use std::{env, sync::Arc};

use axum::{
  http::{HeaderMap, StatusCode},
  routing::post,
  Extension, Router,
};

// use prisma_client_rust::{and};
use super::{PrivateCtx, PrivateRouter};
use prisma::{collection, pinned_user_collections};
use rspc::{Error, ErrorCode, RouterBuilder, Type};
use serde::{Deserialize, Serialize};
use svix::webhooks::Webhook;
collection::include!(collection_with_pinned_status {
  pinned_by: select {
    user: select { id }
  }
});

use crate::prisma::{
  self, link::collection_id, pinned_user_collections::user_id, user::pinned_collections,
  PrismaClient,
};

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    .query("getByUser", |t| {
      // struct CollectionIsPinned {
      //   ...prisma::

      // }
      t(|ctx: PrivateCtx, _: ()| async move {
        let collections = ctx
          .db
          .collection()
          .find_many(vec![collection::owner_id::equals(ctx.user_id.clone())])
          .include(collection_with_pinned_status::include())
          .exec()
          .await?;
        tracing::info!("collections of user:{:?} are fetched", ctx.user_id);
        Ok(collections)
      })
    })
    .query("getPinned", |t| {
      t(|ctx: PrivateCtx, _: ()| async move {
        pinned_user_collections::select!(PinnedCollections { collection });

        let pinned_collections = ctx
          .db
          .pinned_user_collections()
          .find_many(vec![pinned_user_collections::user_id::equals(
            ctx.user_id.clone(),
          )])
          .select(PinnedCollections::select())
          .exec()
          .await?;
        tracing::info!(
          "collections of user:{:?} with Pin Status are fetched",
          ctx.user_id
        );
        Ok(pinned_collections)
      })
    })
    .query("getById", |t| {
      t(|ctx: PrivateCtx, id: i32| async move {
        let collection = ctx
          .db
          .collection()
          .find_first(vec![
            collection::id::equals(id),
            // prisma::collection::owner_id::equals(ctx.user_id)
          ])
          .exec()
          .await?;
        tracing::info!("collections {:?} is fetched", id);
        Ok(collection)
      })
    })
    .query("getOnePinnedStatus", |t| {
      use prisma::{collection, pinned_user_collections};
      t(|ctx: PrivateCtx, id: i32| async move {
        let collection = ctx
          .db
          .collection()
          .find_first(vec![collection::id::equals(id)])
          .with(collection::pinned_by::fetch(vec![
            pinned_user_collections::user_id::equals(ctx.user_id),
          ]))
          .include(collection_with_pinned_status::include())
          .exec()
          .await?;
        tracing::info!("collection {:?} with Pin Status is fetched", id);
        Ok(collection)
      })
    })
    .query("getAllWithPinned", |t| {
      t(|ctx: PrivateCtx, _: ()| async move {
        let collections: Vec<_> = ctx
          .db
          .collection()
          .find_many(vec![collection::owner_id::equals(ctx.user_id.clone())])
          .with(collection::pinned_by::fetch(vec![
            pinned_user_collections::user_id::equals(ctx.user_id.clone()),
          ]))
          .include(collection_with_pinned_status::include())
          .exec()
          .await?;
        tracing::info!(
          "collections of user: {:?} with Pin Status is fetched",
          ctx.user_id
        );
        Ok(collections)
      })
    })
    .mutation("addPinned", |t| {
      t(|ctx: PrivateCtx, collection_id| async move {
        let pinned_collection = ctx
          .db
          .pinned_user_collections()
          .create(
            prisma::user::id::equals(ctx.user_id),
            prisma::collection::id::equals(collection_id),
            vec![],
          )
          .exec()
          .await?;
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

      t(
        |ctx: PrivateCtx,
         CreateCollectionArgs {
           name,
           color,
           pinned,
           public,
         }| async move {
          let new_collection = ctx
            .db
            .collection()
            .create(
              name,
              prisma::user::id::equals(ctx.user_id.clone()),
              vec![
                prisma::collection::color::set(color),
                prisma::collection::is_public::set(public),
              ],
            )
            .exec()
            .await?;
          if pinned {
            ctx
              .db
              .pinned_user_collections()
              .create(
                prisma::user::id::equals(ctx.user_id),
                prisma::collection::id::equals(new_collection.id),
                vec![],
              )
              .exec()
              .await?;
          }

          Ok(new_collection)
        },
      )
    })
    .mutation("editSingle", |t| {
      #[derive(Deserialize, Type)]
      struct EditCollectionArgs {
        id: i32,
        name: String,
        color: String,
        pinned: bool,
        public: bool,
      }
      use prisma::{collection, pinned_user_collections};
      t(
        |ctx: PrivateCtx,
          EditCollectionArgs {
            id,
            name,
            color,
            pinned,
            public,
          }| async move {
          println!("update collection!");
          //TODO: create a macro to generate the set value vector
          let updated_collection = ctx
            .db
            .collection()
            .update(
              prisma::collection::id::equals(id),
              vec![
                collection::name::set(name),
                collection::color::set(color),
                collection::is_public::set(public),
              ],
            )
            .exec()
            .await?;
          if pinned {
            // ctx.db.pinned_user_collections().find_unique(vec![
            //     prisma::pinned_user_collections::user_id::equals(ctx.user_id),
            //     prisma::pinned_user_collections::collection_id::equals(id),
            // ]).exec().await?;
            ctx
              .db
              .pinned_user_collections()
              .upsert(
                pinned_user_collections::UniqueWhereParam::UserIdCollectionIdEquals(
                  ctx.user_id.clone(),
                  id,
                ),
                pinned_user_collections::create(
                  prisma::user::id::equals(ctx.user_id.clone()),
                  prisma::collection::id::equals(id),
                  vec![],
                ),
                vec![],
              )
              .exec()
              .await?;
          } else {
            ctx
              .db
              .pinned_user_collections()
              .delete(
                pinned_user_collections::UniqueWhereParam::UserIdCollectionIdEquals(
                  ctx.user_id.clone(),
                  id,
                ))
              .exec()
              .await?;
          }
          tracing::info!("user: {:?} updated collection: {:?} success", ctx.user_id, id);
          Ok(updated_collection)
        },
      )
    })
}
