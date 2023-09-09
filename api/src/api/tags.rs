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
            #[derive(Debug, Clone, Deserialize, Serialize, Type)]
            struct CreateTagArgs {
                tag_name: String,
            }

            t(|ctx: PrivateCtx, CreateTagArgs { tag_name }| async move {
                let new_tag = ctx
                    .db
                    .tag()
                    .create(tag_name, ctx.user_id, vec![])
                    .exec()
                    .await?;
            })
        })
}
