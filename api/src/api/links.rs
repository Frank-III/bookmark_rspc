use std::{env, sync::Arc, vec};

use super::{PrivateCtx, PrivateRouter};
use crate::prisma::{self, link, PrismaClient};
use axum::{
  http::{HeaderMap, StatusCode},
  routing::post,
  Extension, Router,
};
use prisma_client_rust::{
  and,
  chrono::{DateTime, FixedOffset},
  raw, PrismaValue,
};
use rspc::{Error, ErrorCode, RouterBuilder, Type};
use serde::{Deserialize, Serialize};

prisma::link::include!( link_with_tags {
  tags: select {
    id
    name
    color
  }
});

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    .query("getByDate", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct GetByDateArgs {
        date: String,
        size: Option<i32>,
      }
      t(|ctx: PrivateCtx, GetByDateArgs {date, size}| async move {
        println!("date: {}", date);
        let links = ctx
          .db
          .link()
          .find_many(vec![
            prisma::link::owner_id::equals(ctx.user_id),
            // and!(prisma::link::created_at::equals(date)),
            prisma::link::created_at::gte(
              DateTime::<FixedOffset>::parse_from_rfc3339(&format!("{}T00:00:00+00:00", date))
                .unwrap(),
            ),
            and!(prisma::link::created_at::lte(
              DateTime::<FixedOffset>::parse_from_rfc3339(&format!("{}T23:59:59+00:00", date))
                .unwrap()
            )),
          ]).order_by(prisma::link::created_at::order(prisma_client_rust::Direction::Desc));
        match size {
          None => Ok(links.include(link_with_tags::include()).exec().await?),
          Some(sz) => Ok(links.take(sz as i64).include(link_with_tags::include()).exec().await?),
        }
      })
    })
    .query("getByUser", |t| {
      t(|ctx: PrivateCtx, _: ()| async move {
        let links = ctx
          .db
          .link()
          .find_many(vec![prisma::link::owner_id::equals(ctx.user_id.clone())])
          .include(link_with_tags::include())
          .exec()
          .await?;
        tracing::info!("links of user:{:?} are fetched", ctx.user_id);
        Ok(links)
      })
    })
    .query("getByCollection", |t| {
      t(|ctx: PrivateCtx, id: i32| async move {
        let links = ctx
          .db
          .link()
          .find_many(vec![
            prisma::link::owner_id::equals(ctx.user_id.clone()),
            prisma::link::collection_id::equals(id),
          ]).include(link_with_tags::include())
          .exec()
          .await?;
        tracing::info!("links of collection: {:?} is fetched", id);
        Ok(links)
      })
    })
    .query("getById", |t| {

      t(|ctx: PrivateCtx, id: i32| async move {
        let link = ctx
          .db
          .link()
          .find_first(vec![
            prisma::link::id::equals(id),
          ]).include(link_with_tags::include())
          .exec()
          .await?;
        tracing::info!("link: {:?} is fetched", id);
        Ok(link)
      })
    })
    .query("filterByTags", |t| {

      enum Mode {
        And,
        Or
      }
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct FilterByTagsArgs {
        mode: Mode,
        tags: Vec<i32>,
      }
      t(|ctx: PrivateCtx, FilterByTagsArgs{ mode,  tags}| async move {
        let filter_cond = match mode {
          Mode::And => prisma::link::tags::every(tags.iter().map(|tag_id| prisma::tag::id::equals(*tag_id)).collect::<Vec<_>>()),
          Mode::Or => prisma::link::tags::some(tags.iter().map(|tag_id| prisma::tag::id::equals(*tag_id)).collect::<Vec<_>>())
        };
        let links = ctx
          .db
          .link()
          .find_many(vec![
            prisma::link::owner_id::equals(ctx.user_id.clone()),
            filter_cond
          ]).include(link_with_tags::include())
          .exec()
          .await?;
        tracing::info!("links of tags: {:?} is fetched", tags);
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
        let summaries: Vec<SummariesData> = ctx
          .db
          ._query_raw(raw!(
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
          ))
          .exec()
          .await?;
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
        let archived = ctx
          .db
          .link()
          .count(vec![
            prisma::link::owner_id::equals(ctx.user_id.clone()),
            and!(prisma::link::archived::equals(true)),
          ])
          .exec()
          .await?;
        let not_archived = ctx
          .db
          .link()
          .count(vec![
            prisma::link::owner_id::equals(ctx.user_id),
            and!(prisma::link::archived::equals(false)),
          ])
          .exec()
          .await?;
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
        tags: Vec<i32>
      }
      t(
        |ctx: PrivateCtx,
         CreateLinkArgs {
           link_name,
           url,
           description,
           collection_id,
           tags
         }| async move {

          let tag_unique_where = tags.iter().map(|tag_id| prisma::tag::id::equals(*tag_id)).collect::<Vec<_>>();

          let new_link = ctx
            .db
            .link()
            .create(
              link_name,
              url,
              prisma::user::id::equals(ctx.user_id),
              prisma::collection::id::equals(collection_id),
              vec![prisma::link::description::set(
                description.unwrap_or("".into()),),
                prisma::link::tags::connect(tag_unique_where)
                ],
            )
            .exec()
            .await?;
          Ok(new_link)
        },
      )
    })
    .mutation("editOne", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct EditLinkArgs {
        id: i32,
        link_name: String,
        url: String,
        description: Option<String>,
        collection_id: i32,
        new_tags: Vec<i32>,
        deleted_tags: Vec<i32>,
      }

      t(|ctx: PrivateCtx, EditLinkArgs {id, link_name, url, description, collection_id, new_tags, deleted_tags}| async move{

        let edited_link = ctx.db.link().update(
          prisma::link::id::equals(id),
          vec![
            prisma::link::name::set(link_name),
            prisma::link::url::set(url),
            prisma::link::description::set(description.unwrap_or("".into())),
            prisma::link::collection_id::set(collection_id),
            prisma::link::tags::connect(new_tags.iter().map(|tag_id| prisma::tag::id::equals(*tag_id)).collect::<Vec<_>>()),
            prisma::link::tags::disconnect(deleted_tags.iter().map(|tag_id| prisma::tag::id::equals(*tag_id)).collect::<Vec<_>>())
          ]).exec().await?;
        Ok(edited_link)
      })
    })
    .mutation("deleteOne", |t| {
      
      t(|ctx: PrivateCtx, id:i32 | async move {
        let deleted_link = ctx
          .db
          .link()
          .delete(
            prisma::link::id::equals(id),
          )
          .exec()
          .await?;
        Ok(deleted_link)
      })
    })
}
