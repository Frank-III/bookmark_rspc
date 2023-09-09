use std::{ env, sync::Arc };

use axum::{ http::{ HeaderMap, StatusCode }, routing::post, Extension, Router };

use rspc::{ Error, ErrorCode, RouterBuilder, Type };
use super::{ PrivateCtx, PrivateRouter };
use serde::{ Deserialize, Serialize };
use svix::webhooks::Webhook;

use crate::prisma::{ self, PrismaClient };

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
    PrivateRouter::new()
    .query("getPinned", |t| {
        t(|ctx: PrivateCtx, _:()| async move {
            let users = ctx.db
            .user()
            .find_first(vec![prisma::user::id::equals(ctx.user_id)])
            .exec().await?;
            Ok(users)
        })
    })
}


