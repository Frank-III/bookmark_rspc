use std::{ env, sync::Arc };

use axum::{ http::{ HeaderMap, StatusCode }, routing::post, Extension, Router };

use rspc::{ Error, ErrorCode, RouterBuilder, Type };
use super::{ PrivateCtx, PrivateRouter };
use serde::{ Deserialize, Serialize };
use svix::webhooks::Webhook;

use crate::prisma::{ self, PrismaClient, link };

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
                prisma::collection::id::equals(collection_id),
                vec![
                    prisma::link::description::set(description.unwrap_or("".into()))
                ]).exec().await?;
            Ok(new_link)
        })
    })
}


