use std::{env, sync::Arc};

use axum::{
  http::{HeaderMap, StatusCode},
  routing::post,
  Extension, Router,
};

use super::{PrivateCtx, PrivateRouter};
use rspc::{Error, ErrorCode, RouterBuilder, Type};
use serde::{Deserialize, Serialize};
use svix::webhooks::Webhook;

use crate::prisma::{self, PrismaClient};

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    .query("getByUser", |t| {
      t(|ctx: PrivateCtx, _: ()| async move {
        let tags = ctx
          .db
          .tag()
          .find_many(vec![prisma::tag::owner_id::equals(ctx.user_id)])
          .exec()
          .await?;
        Ok(tags)
      })
    })
    .mutation("create", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct CreateTagArgs {
        tag_name: String,
        color: String,
      }

      t(
        |ctx: PrivateCtx, CreateTagArgs { tag_name, color }| async move {
          let new_tag = ctx
            .db
            .tag()
            .create(
              tag_name,
              color,
              prisma::user::id::equals(ctx.user_id),
              vec![],
            )
            .exec()
            .await?;
          Ok(new_tag)
        },
      )
    })
    .mutation("edit", |t| {
      #[derive(Debug, Deserialize, Serialize, Type)]
      struct UpdateTagArgs {
        tag_id: i32,
        tag_name: String,
        color: String,
      }
      t(
        |ctx: PrivateCtx,
         UpdateTagArgs {
           tag_id,
           tag_name,
           color,
         }| async move {
          let new_tag = ctx
            .db
            .tag()
            .update(
              prisma::tag::id::equals(tag_id),
              vec![
                prisma::tag::name::set(tag_name),
                prisma::tag::color::set(color),
              ],
            )
            .exec()
            .await?;
          Ok(new_tag)
        },
      )
    })
    .mutation("delete", |t| {
      t(|ctx: PrivateCtx, id: i32| async move {
        let new_tag = ctx
          .db
          .tag()
          .delete(prisma::tag::id::equals(id))
          .exec()
          .await?;
        Ok(new_tag)
      })
    })
}
