use std::{ env, sync::Arc };

use axum::{ http::{ HeaderMap, StatusCode }, routing::post, Extension, Router };
use prisma_client_rust::{chrono::{DateTime, FixedOffset}, and, raw, PrismaValue};
use rspc::{ Error, ErrorCode, RouterBuilder, Type };
use super::{ PrivateCtx, PrivateRouter };
use serde::{ Deserialize, Serialize };
use svix::webhooks::Webhook;
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
                r#"SELECT
                    createdAt AS date,
                    COUNT(*) AS count
                FROM
                    Link
                WHERE
                    ownerId = {} 
                    AND createdAt >= NOW() - INTERVAL '1 day' * {}
                GROUP BY
                    createdAt"#,
                PrismaValue::String(ctx.user_id),
                PrismaValue::Int(time_span.map_or(365, |x| x.parse::<i64>().unwrap_or(365)))
            )).exec().await?;
            Ok(summaries)
        })
    })
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


