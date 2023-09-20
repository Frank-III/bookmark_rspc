use std::sync::Arc;

use crate::prisma;
use crate::utils::get_user;
use axum::http::HeaderValue;
use rspc::{Config, Error, ErrorCode};
use std::path::PathBuf;

use self::users::Role;
mod collections;
mod links;
mod tags;
pub mod users;

#[derive(Clone, Debug)]
pub struct Ctx {
    pub db: Arc<prisma::PrismaClient>,
    pub token: Option<HeaderValue>,
}

#[derive(Clone, Debug)]
pub struct PrivateCtx {
    pub db: Arc<prisma::PrismaClient>,
    pub role: Role,
    pub user_id: String,
}

pub struct AdminCtx {
    pub db: Arc<prisma::PrismaClient>,
    pub user_id: String,
}

pub type PublicRouter = rspc::Router<Ctx>;
pub type PrivateRouter = rspc::Router<PrivateCtx>;
pub type AdminRouter = rspc::Router<AdminCtx>;

pub(crate) fn new() -> PublicRouter {
    PublicRouter::new()
        .config(
            Config::new().export_ts_bindings(
                PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../bindings.ts"),
            ),
        )
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
        .middleware(|mw| {
            mw.middleware(|mw| async move {
                let old_ctx: Ctx = mw.ctx.clone();
                let role = match get_user(old_ctx.token) {
                    Some(Role::Admin(id)) => Role::Admin(id),
                    Some(Role::Customer(id)) => Role::Customer(id),
                    Some(Role::None) => {
                        return Err(Error::new(
                            ErrorCode::Unauthorized,
                            "Unauthorized".to_string(),
                        ));
                    }
                    None => {
                        return Err(Error::new(
                            ErrorCode::Unauthorized,
                            "JWT header not found".to_string(),
                        ));
                    }
                };
                tracing::info!("User role: {:?}", role);
                Ok(mw.with_ctx(PrivateCtx {
                    db: old_ctx.db,
                    role: role.clone(),
                    user_id: role.get_id(),
                }))
            })
        })
        .merge("users.", users::private_route())
        .merge("tags.", tags::private_route())
        .merge("collections.", collections::private_route())
        .merge("links.", links::private_route())
        .build()
}
