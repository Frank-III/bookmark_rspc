use std::{ env, sync::Arc, vec };

use axum::{ http::{ HeaderMap, StatusCode }, routing::post, Extension, Router };
use prisma_client_rust::{chrono::{DateTime, FixedOffset}, and, raw, PrismaValue};
use rspc::{ Error, ErrorCode, RouterBuilder, Type };
use super::{ PrivateCtx, PrivateRouter };
use serde::{ Deserialize, Serialize };
use crate::prisma::{ self, PrismaClient, link };


pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
    PrivateRouter::new()
    .query("getByDate", |t| {
        t(|ctx: PrivateCtx, date: String | async move {
            println!("date: {}", date);
            let links = ctx.db.link().find_many(vec![
                prisma::link::owner_id::equals(ctx.user_id),
                // and!(prisma::link::created_at::equals(date)),
                prisma::link::created_at::gte(
                    DateTime::<FixedOffset>
                    ::parse_from_rfc3339(&format!("{}T00:00:00+00:00", date))
                    .unwrap()
                ),
                and!(
                    prisma::link::created_at::lte(
                    DateTime::<FixedOffset>
                        ::parse_from_rfc3339(&format!("{}T23:59:59+00:00", date))
                        .unwrap()
                    )
                )
            ]).exec().await?;
            tracing::info!("{links:?}");
            Ok(links)
        })
    })
    .query("getSummary", |t| {
        t(|ctx: PrivateCtx, time_span: Option<String>| async move {
            #[derive(Debug, Serialize, Deserialize, Type)]
            struct SummariesData {
                date: String,
                count: i32,
            }
            let summaries : Vec<SummariesData> = ctx.db._query_raw(raw!(
                "SELECT
                    createdAt AS date,
                    COUNT(*) AS count
                FROM
                    Link
                WHERE
                    ownerId = {} 
                    AND createdAt >= NOW() - INTERVAL '1 day' * {}
                GROUP BY
                    createdAt",
                PrismaValue::String(ctx.user_id),
                PrismaValue::Int(time_span.map_or(365, |x| x.parse::<i64>().unwrap_or(365)))
            )).exec().await?;
            Ok(summaries)
        })
    })
    .query("archiveStatByDate", |t| {

        #[derive(Serialize, Deserialize, Type)]
        struct ArchiveStatData {
            total: i32,
            archived: i32,
            not_archived: i32,
        }
        // TODO: make the date count work
        t(|ctx: PrivateCtx, _: Option<String>| async move {
            let archived = ctx.db.link().count(vec![prisma::link::owner_id::equals(ctx.user_id.clone()), and!(prisma::link::archived::equals(true))]).exec().await?;                
            let not_archived = ctx.db.link().count(vec![prisma::link::owner_id::equals(ctx.user_id), and!(prisma::link::archived::equals(false))]).exec().await?;                
            Ok(ArchiveStatData {
                total: (archived + not_archived) as i32,
                archived: archived as i32,
                not_archived: not_archived as i32,
            })
        })
    })
    // .query("archiveStatByCollection", |t| {
    //     // TODO: rethink the design
    //     #[derive(Serialize, Deserialize, Type)]
    //     struct ArchiveStatCollectionData {
    //         collection: prisma::collection::Data,
    //         total: i64,
    //         archived: i64,
    //         not_archived: i64,
    //     }
    //     t(|ctx: PrivateCtx, collection_id: i32| async move {
    //         let archived = ctx.db.link().count(vec![prisma::link::owner_id::equals(ctx.user_id.clone()), and!(prisma::link::collection_id::equals(collection_id)), and!(prisma::link::archived::equals(true))]).exec().await?;                
    //         let not_archived = ctx.db.link().count(vec![prisma::link::owner_id::equals(ctx.user_id.clone()), and!(prisma::link::collection_id::equals(collection_id)), and!(prisma::link::archived::equals(false))]).exec().await?;                
    //         let collection = ctx.db.collection().find_first(vec![prisma::collection::id::equals(collection_id), and!(prisma::collection::owner_id::equals(ctx.user_id))]).exec().await?;


    //         Ok(ArchiveStatCollectionData {
    //             collection: collection.unwrap(), 
    //             total: archived + not_archived,
    //             archived,
    //             not_archived,
    //         })

    //     })
    // })
    .mutation("create", |t| {
        #[derive(Debug, Deserialize, Serialize, Type)]
        struct CreateLinkArgs {
            link_name: String,
            url: String,
            description: Option<String>,
            collection_id: i32,
        }
        t(|ctx: PrivateCtx, CreateLinkArgs {link_name, url, description, collection_id}| async move {
            let new_link = ctx.db.link().create(
                link_name,
                url,
                prisma::user::id::equals(ctx.user_id),
                prisma::collection::id::equals(collection_id),
                vec![
                    prisma::link::description::set(description.unwrap_or("".into()))
                ]).exec().await?;
            Ok(new_link)
        })
    })
}


