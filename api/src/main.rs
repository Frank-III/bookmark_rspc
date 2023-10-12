#![allow(unused)]
use axum::{
  http::{header::AUTHORIZATION, Method},
  http::{
    header::{ACCEPT, CONTENT_TYPE},
    HeaderValue,
  },
  routing::get,
};
use rspc::integrations::httpz::Request;
use std::{env, net::SocketAddr, sync::Arc};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod api;
mod prisma;
mod trace_layer;
mod utils;

fn router(client: Arc<prisma::PrismaClient>) -> axum::Router {
  let router = api::new().arced();

  axum::Router::new()
    .route("/", get(|| async { "Hello 'rspc'!" }))
    .merge(api::users::webhooks(client.clone()))
    .nest(
      "/rspc",
      router
        .endpoint(move |req: Request| {
          println!("Client requested operation '{}'", &req.uri().path());
          let token = req.headers().get(AUTHORIZATION).cloned();

          api::Ctx {
            db: client.clone(),
            token,
          }
        })
        .axum(),
    )
    .layer(
      CorsLayer::new()
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, CONTENT_TYPE, ACCEPT])
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(
          [env::var("FRONTEND_URL")
            .unwrap_or("http://localhost:3000".to_string())
            .parse::<HeaderValue>()
            .unwrap(),
            String::from("tauri://localhost").parse::<HeaderValue>().unwrap()]
        ),
    )
}

#[tokio::main]
async fn main() {
  tracing_subscriber::registry()
    .with(
      tracing_subscriber::EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| "example_customize_path_rejection=debug".into()),
    )
    .with(tracing_subscriber::fmt::layer())
    .init();

  let trace_layer = TraceLayer::new_for_http()
    .make_span_with(trace_layer::trace_layer_make_span_with)
    .on_request(trace_layer::trace_layer_on_request)
    .on_response(trace_layer::trace_layer_on_response);

  dotenv::dotenv().ok();

  let port = env::var("PORT").unwrap_or("9000".to_string());
  let client = Arc::new(prisma::new_client().await.unwrap());

  let addr = format!("[::]:{}", port).parse::<SocketAddr>().unwrap(); // This listens on IPv6 and IPv4
  tracing::info!("{} listening on http://{}", env!("CARGO_CRATE_NAME"), addr);
  axum::Server::bind(&addr)
    .serve(
      router(client)
        .layer(trace_layer)
        .into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(utils::axum_shutdown_signal())
    .await
    .expect("Error with HTTP server!");
}
