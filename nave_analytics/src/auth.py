import os
import time
from functools import wraps

import requests
from flask import current_app, jsonify, request
from jose import jwk, jwt
from jose.utils import base64url_decode

REGION = os.environ.get("NAVE_REGION", "us-east-1")
USERPOOL_ID = os.environ.get("NAVE_COGNITO_USER_POOL_ID", "us-east-1_cnMzGNqqH")
APP_CLIENT_ID = os.environ.get("NAVE_CLIENT_ID", "")


def _cognito_public_keys() -> list[dict[str, str]]:
    """Return public keys from Cognito."""
    response = requests.get(
        f"https://cognito-idp.{REGION}.amazonaws.com/{USERPOOL_ID}/.well-known/jwks.json"
    )
    return response.json().get("keys", [])


KEYS = _cognito_public_keys()


def get_current_client_id() -> str:
    """Get the client ID from the token."""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return ""
    token = auth_header.split(" ")[1]
    claims = jwt.get_unverified_claims(token)
    return claims["client_id"]


def is_api_user() -> bool:
    """Check if the user is an API user."""
    auth_header = request.headers.get("Authorization")
    token = auth_header.split(" ")[1]
    claims = jwt.get_unverified_claims(token)
    return "username" not in claims


def verify_cognito_token(token: str) -> bool:
    """Verify Cognito token."""
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    key_index = -1
    for i in range(len(KEYS)):
        if kid == KEYS[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        return False
    public_key = jwk.construct(KEYS[key_index])
    message, encoded_signature = str(token).rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        return False
    claims = jwt.get_unverified_claims(token)
    if time.time() > claims["exp"]:
        return False
    if claims["iss"] != 'https://cognito-idp.{}.amazonaws.com/{}'.format(REGION, USERPOOL_ID) :
        return False
    return True


def jwt_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_app.debug:
            return func(*args, **kwargs)

        # Extract the JWT token from the request headers
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header not provided"}), 401
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return jsonify({"error": "Invalid token format"}), 401

        # Verify the JWT token
        try:
            verified = verify_cognito_token(token)
        except jwt.JWTError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception:
            return jsonify({"error": "Unknown error parsing token"}), 401

        if not verified:
            return jsonify({"error": "Invalid token"}), 401

        return func(*args, **kwargs)

    return wrapper
