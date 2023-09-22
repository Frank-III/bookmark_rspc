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

use crate::prisma::{self, PrismaClient, user::pinned_collections, link::collection_id};

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
    .query("getById", |t| {
        t(|ctx: PrivateCtx, id: i32| async move {
            let collection = ctx.db
            .collection()
            .find_first(vec![
                prisma::collection::id::equals(id),
                // prisma::collection::owner_id::equals(ctx.user_id)
            ])
            .exec().await?;
            Ok(collection)
        })
    })
    .mutation("addPinned", |t| {
        
        t(|ctx: PrivateCtx, collection_id| async move {
            let pinned_collection = ctx.db
            .pinned_user_collections()
            .create(
                prisma::user::id::equals(ctx.user_id), 
                prisma::collection::id::equals(collection_id),
                vec![]
            )
            .exec().await?;
            Ok(pinned_collection)
        })
    })
    .mutation("create", |t| {

        #[derive(Deserialize, Type)]
        struct CreateCollectionArgs {
            name: String,
            color: String,
            pinned: bool,
            public: bool,
        }

        
        t(|ctx: PrivateCtx, CreateCollectionArgs {name, color, pinned, public}| async move {
            let new_collection = ctx.db
            .collection()
            .create(name, prisma::user::id::equals(ctx.user_id.clone()), vec![
                prisma::collection::color::set(color),
                prisma::collection::is_public::set(public),
            ]).exec().await?;
            if pinned {
                ctx.db
                .pinned_user_collections()
                .create(
                    prisma::user::id::equals(ctx.user_id), 
                    prisma::collection::id::equals(new_collection.id),
                    vec![]
                )
                .exec().await?;
            }

            Ok(new_collection)
        })
    })
    .mutation("editCollection", |t| {

        #[derive(Deserialize, Type)]
        struct EditCollectionArgs {
            id: i32,
            name: Option<String>,
            color: Option<String>,
            pinned: Option<bool>,
            public: Option<bool>,
        }

        t(|ctx: PrivateCtx, EditCollectionArgs {id, name, color, pinned, public}| async move {
            //TODO: create a macro to generate the set value vector
            let updated_collection = ctx.db.collection().update(
                prisma::collection::id::equals(id),
                vec![]
            ).exec().await?;
            Ok(updated_collection)
        })
    })
}
