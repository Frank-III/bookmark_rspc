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

use crate::prisma::{self, PrismaClient, user::pinned_collections};

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
    PrivateRouter::new()
    .query("getByUser", |t| {
        t(|ctx: PrivateCtx, _: ()| async move {
            let tags = ctx
                .db
                .collection()
                .find_many(vec![prisma::collection::owner_id::equals(ctx.user_id)])
                .exec()
                .await?;
            Ok(tags)
        })
    })
    .query("getPinned", |t| {
        t(|ctx: PrivateCtx, _:()| async move {
            prisma::pinned_user_collections::select!(PinnedCollections {
                collection
            });

            let pinned_collections = ctx.db
            .pinned_user_collections()
            .find_many(vec![prisma::pinned_user_collections::user_id::equals(ctx.user_id)])
            .select(PinnedCollections::select())
            .exec().await?;
            Ok(pinned_collections)
        })
    })
}
