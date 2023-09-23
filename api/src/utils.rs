use crate::api::users::Role;
use axum::http::HeaderValue;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::env;
use tokio::signal;

/// shutdown_signal will inform axum to gracefully shutdown when the process is asked to shutdown.
pub async fn axum_shutdown_signal() {
  let ctrl_c = async {
    signal::ctrl_c()
      .await
      .expect("failed to install Ctrl+C handler");
  };

  let terminate = async {
    signal::unix::signal(signal::unix::SignalKind::terminate())
      .expect("failed to install signal handler")
      .recv()
      .await;
  };

  tokio::select! {
      _ = ctrl_c => {},
      _ = terminate => {},
  }

  println!("signal received, starting graceful shutdown");
}

pub(crate) fn get_user(token: Option<HeaderValue>) -> Option<Role> {
  #[derive(Debug, Serialize, Deserialize)]
  struct Claims {
    azp: String,
    exp: usize,
    iat: usize,
    iss: String,
    nbf: usize,
    // sid: String,
    sub: String,
    role: Option<String>,
  }

  let jwt = token?;
  // TODO: fix this
  // let key = "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx+gnISYJEW/H8owHAJlYiADBLlkH/pVJrFGRW7usrsvQ2hLV4DzuixmgMJ42T5BsxY4PPoU7a1gjnEYER+YUMAgImwfaK5jJ4THLtP5f/nkcs5NF4S3/tkdiIczWZpiAzDJigPAe+ZmMA91bf6ouSASJq0lKc2Lgn6RmTLeOBHlLBMwktQWb0zJFgT6bYhg0SvZIHEZemwHcU7/wnuvgrakT82kpwFT/t575qBPMSfgUfwcOFAfc/rK8/d2uz5zkprxv/NbleuO02A7hs76zsyateQv54N5OEbtH2sU0mkEVSHDRZTyWSphhbkNRn+kDI8DUcmN7d46bwHVURIN4MQIDAQAB-----END PUBLIC KEY-----".to_string();
  let key = env::var("CLERK_PEM_PUBLIC_KEY").expect("CLERK_PEM_PUBLIC_KEY not found");
  // .replace("\\n", "\n");
  let decode = decode::<Claims>(
    &jwt.to_str().unwrap().trim_start_matches("Bearer "),
    &DecodingKey::from_rsa_pem(key.as_bytes()).unwrap(),
    &Validation::new(Algorithm::RS256),
  );

  let role: Role = match decode {
    Ok(token) => match token.claims.role {
      Some(role) => match role.as_str() {
        "admin" => Role::Admin(token.claims.sub),
        _ => Role::None,
      },
      None => Role::Customer(token.claims.sub),
    },
    Err(_) => Role::None,
  };

  Some(role)
}
