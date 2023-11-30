use std::{env, sync::Arc, vec};

use super::{PrivateCtx, PrivateRouter};
use crate::prisma::{
  self,
  link::{self, WhereParam},
  PrismaClient,
};
use axum::{
  http::{HeaderMap, StatusCode},
  routing::post,
  Extension, Router,
};
use hyper::client::connect::dns::Name;
use prisma_client_rust::{
  and,
  chrono::{DateTime, FixedOffset},
  raw, PrismaValue,
};
use rspc::{Error, ErrorCode, RouterBuilder, Type};
use serde::{de, Deserialize, Serialize};
use tracing::span::Id;

prisma::link::include!( link_with_tags {
  tags: select {
    id
    name
    color
  }
});

#[derive(Debug, Deserialize, Type)]
pub enum LinkGetter {
  Date(String),
  Collection(i32),
  Name(String),
  Id(i32),
}

#[derive(Debug, Deserialize, Serialize, Type)]
pub struct FilterResult {
  total_links: Option<i32>,
  links: Vec<link_with_tags::Data>,
}
// TODO: can I make a generic getBy function and searchBy function ?
pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    //TODO: but how to query when the user is the owner of the link?
    .query("getBy", |t| {
      #[derive(Debug, Deserialize, Type)]
      struct LinkGetterArgs {
        getter: Option<LinkGetter>,
        user_id: Option<String>,
        take: Option<i32>,
        skip: Option<i32>,
      }

      t(
        |ctx,
         LinkGetterArgs {
           getter,
           user_id,
           take,
           skip,
         }| async move {
          let mut where_params: Vec<WhereParam> = vec![];

          match (getter, user_id) {
            (None, None) | (Some(_), None) => {
              return Err(Error::new(
                ErrorCode::BadRequest,
                String::from("getter and user_id cannot be both empty"),
              ))
            }
            (None, Some(user_id)) => where_params.push(prisma::link::owner_id::equals(user_id)),
            (Some(LinkGetter::Id(id)), _) => where_params.push(prisma::link::id::equals(id)),
            (Some(val), Some(user_id)) => {
              // FIXME: should I check more things
              where_params.push(prisma::link::owner_id::equals(user_id));
              match val {
                LinkGetter::Date(date) => where_params.extend(vec![
                  prisma::link::created_at::gte(
                    DateTime::<FixedOffset>::parse_from_rfc3339(&format!(
                      "{}T00:00:00+00:00",
                      date
                    ))
                    .unwrap(),
                  ),
                  and!(prisma::link::created_at::lte(
                    DateTime::<FixedOffset>::parse_from_rfc3339(&format!(
                      "{}T23:59:59+00:00",
                      date
                    ))
                    .unwrap()
                  )),
                ]),
                LinkGetter::Collection(id) => {
                  where_params.push(prisma::link::collection_id::equals(id))
                }
                LinkGetter::Name(name) => where_params.push(prisma::link::name::contains(name)),
                _ => {}
              };
            }
          };

          let links_query = ctx.db.link().find_many(where_params);

          let links = match (skip, take) {
            (Some(skip), Some(take)) => links_query.skip(skip as i64).take(take as i64),
            (Some(skip), None) => links_query.skip(skip as i64),
            (None, Some(take)) => links_query.take(take as i64),
            (None, None) => links_query,
          }
          .include(link_with_tags::include())
          .exec()
          .await?;

          match skip {
            Some(_) => Ok(FilterResult {
              total_links: Some(links.len() as i32),
              links,
            }),
            None => Ok(FilterResult {
              total_links: None,
              links,
            }),
          }
        },
      )
    })
    .query("getByDate", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct GetByDateArgs {
        date: String,
        size: Option<i32>,
      }
      t(|ctx: PrivateCtx, GetByDateArgs { date, size }| async move {
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
          ])
          .order_by(prisma::link::created_at::order(
            prisma_client_rust::Direction::Desc,
          ));
        match size {
          None => Ok(links.include(link_with_tags::include()).exec().await?),
          Some(sz) => Ok(
            links
              .take(sz as i64)
              .include(link_with_tags::include())
              .exec()
              .await?,
          ),
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
          ])
          .include(link_with_tags::include())
          .exec()
          .await?;
        tracing::info!("links of collection: {:?} is fetched", id);
        Ok(links)
      })
    })
    .query("searchByWord", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      enum SearchMode {
        Name,
        Description,
        Url,
      }
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct SearchByNameArgs {
        mode: SearchMode,
        word: String,
        collection_id: Option<i32>,
        take: i32,
        skip: i32,
      }

      t(
        |ctx: PrivateCtx,
         SearchByNameArgs {
           mode,
           word,
           collection_id,
           take,
           skip,
         }| async move {
          let mut filter_cond = vec![prisma::link::owner_id::equals(ctx.user_id.clone())];
          match collection_id {
            None => {}
            Some(id) => {
              filter_cond.push(prisma::link::collection_id::equals(id));
            }
          };

          if !word.is_empty() {
            match (mode) {
              SearchMode::Name => {
                filter_cond.push(prisma::link::name::contains(word));
              }
              SearchMode::Description => {
                filter_cond.push(prisma::link::description::contains(word));
              }
              SearchMode::Url => {
                filter_cond.push(prisma::link::url::contains(word));
              }
            }
          }

          let total_links = match skip {
            0 => Some(ctx.db.link().count(filter_cond.clone()).exec().await? as i32),
            _ => None,
          };

          let links = ctx
            .db
            .link()
            .find_many(filter_cond)
            .skip(skip as i64)
            .take(take as i64)
            .include(link_with_tags::include())
            .exec()
            .await?;
          // tracing::info!("links of name: {:?} is fetched", name);
          Ok(FilterResult { total_links, links })
        },
      )
    })
    .query("getById", |t| {
      t(|ctx: PrivateCtx, id: i32| async move {
        let link = ctx
          .db
          .link()
          .find_first(vec![prisma::link::id::equals(id)])
          .include(link_with_tags::include())
          .exec()
          .await?;
        tracing::info!("link: {:?} is fetched", id);
        Ok(link)
      })
    })
    .query("filterByTags", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      enum Mode {
        And,
        Or,
      }
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct FilterByTagsArgs {
        mode: Mode,
        tags: Vec<i32>,
        take: i32,
        skip: i32,
      }

      t(
        |ctx: PrivateCtx,
         FilterByTagsArgs {
           mode,
           tags,
           skip,
           take,
         }| async move {
          let filter_cond = match (mode, &*tags) {
            (_, []) => vec![prisma::link::owner_id::equals(ctx.user_id.clone())],
            (Mode::And, tgs) => vec![
              prisma::link::owner_id::equals(ctx.user_id.clone()),
              prisma::link::tags::every(
                tgs
                  .iter()
                  .map(|tag_id| prisma::tag::id::equals(*tag_id))
                  .collect::<Vec<_>>(),
              ),
            ],
            (Mode::Or, tgs) => vec![
              prisma::link::owner_id::equals(ctx.user_id.clone()),
              prisma::link::tags::some(
                tags
                  .iter()
                  .map(|tag_id| prisma::tag::id::equals(*tag_id))
                  .collect::<Vec<_>>(),
              ),
            ],
          };

          let total_links = match skip {
            0 => Some(ctx.db.link().count(filter_cond.clone()).exec().await? as i32),
            _ => None,
          };

          let links = ctx
            .db
            .link()
            .find_many(filter_cond)
            .skip(skip as i64)
            .take(take as i64)
            .include(link_with_tags::include())
            .exec()
            .await?;
          tracing::info!("links of tags: {:?} is fetched", tags);
          Ok(FilterResult { total_links, links })
        },
      )
    })
    .query("getSummary", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct SummariesReturnData {
        total_links: i32,
        max_links: i32,
        summaries: Vec<Vec<crate::api::SummariesData>>,
      }
      t(|ctx: PrivateCtx, year: i32| async move {
        let query = format!(
          r#"
SELECT
    Cast(DATE("createdAt") as TEXT) as date,
    COUNT(*) as count
FROM
  "Link"
WHERE
  "ownerId" = '{}'
  AND date_part('year', "createdAt") = {}
GROUP BY
  DATE("createdAt")"#,
          ctx.user_id, year
        );
        let raw = prisma_client_rust::Raw::new(&query, vec![]);
        let summaries: Vec<crate::api::SummariesData> = ctx
          .db
          ._query_raw(raw)
          //   raw!(
          //   PrismaValue::String(ctx.user_id)
          //   // PrismaValue::Int(time_span.map_or(365, |x| x.parse::<i64>().unwrap_or(365)))
          // ))
          .exec()
          .await?;
        println!("summaries: {:?}", summaries);
        let total_links = summaries.iter().fold(0, |acc, x| acc + x.count);
        let max_links = summaries.iter().fold(0, |acc, x| acc.max(x.count));
        let summaries = crate::utils::compute_heatmap_value(year, &summaries);
        Ok(SummariesReturnData {
          total_links,
          max_links,
          summaries,
        })
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
        tags: Vec<i32>,
      }
      t(
        |ctx: PrivateCtx,
         CreateLinkArgs {
           link_name,
           url,
           description,
           collection_id,
           tags,
         }| async move {
          let tag_unique_where = tags
            .iter()
            .map(|tag_id| prisma::tag::id::equals(*tag_id))
            .collect::<Vec<_>>();

          let new_link = ctx
            .db
            .link()
            .create(
              link_name,
              url,
              prisma::user::id::equals(ctx.user_id),
              prisma::collection::id::equals(collection_id),
              vec![
                prisma::link::description::set(description.unwrap_or("".into())),
                prisma::link::tags::connect(tag_unique_where),
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
        archived: bool,
      }

      t(
        |ctx: PrivateCtx,
         EditLinkArgs {
           id,
           link_name,
           url,
           description,
           collection_id,
           new_tags,
           deleted_tags,
           archived,
         }| async move {
          let edited_link = ctx
            .db
            .link()
            .update(
              prisma::link::id::equals(id),
              vec![
                prisma::link::name::set(link_name),
                prisma::link::url::set(url),
                prisma::link::description::set(description.unwrap_or("".into())),
                prisma::link::collection_id::set(collection_id),
                prisma::link::archived::set(archived),
                prisma::link::tags::connect(
                  new_tags
                    .iter()
                    .map(|tag_id| prisma::tag::id::equals(*tag_id))
                    .collect::<Vec<_>>(),
                ),
                prisma::link::tags::disconnect(
                  deleted_tags
                    .iter()
                    .map(|tag_id| prisma::tag::id::equals(*tag_id))
                    .collect::<Vec<_>>(),
                ),
              ],
            )
            .exec()
            .await?;
          Ok(edited_link)
        },
      )
    })
    .mutation("deleteOne", |t| {
      t(|ctx: PrivateCtx, id: i32| async move {
        let deleted_link = ctx
          .db
          .link()
          .delete(prisma::link::id::equals(id))
          .exec()
          .await?;
        Ok(deleted_link)
      })
    })
}
