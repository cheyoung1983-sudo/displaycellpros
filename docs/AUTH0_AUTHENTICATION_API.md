# Auth0 Authentication API & Architecture Reference

> **Documentation Index Source**: [`https://auth0.com/llms.txt`](https://auth0.com/llms.txt) & [`https://auth0.com/docs/llms.txt`](https://auth0.com/docs/llms.txt)  
> **Tenant Base URL**: `https://{yourDomain}`  
> **SDKs Integrated**: `@auth0/nextjs-auth0` (Server) & `@auth0/auth0-react` (Client)

---

## 1. Authentication Methods

The Auth0 Authentication API offers 5 standard authentication methods:

| Method | Application Type | Description & Transport |
| :--- | :--- | :--- |
| **OAuth2 Access Token** | Any authenticated client | Pass `Authorization: Bearer <access_token>` to resource endpoints like `/userinfo`. |
| **Client ID & Client Secret** | Confidential Backend Apps | Sent in request JSON body (`Post`) or `Authorization: Basic base64(client_id:client_secret)` header. |
| **Client ID & Client Assertion** | Zero-Secret / Regulated Backend | Signs a JWT with private key and sends `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer`. |
| **Client ID (Public)** | SPAs & Mobile Native Apps | Uses PKCE (`code_challenge` / `code_verifier`) without exposing credentials. |
| **mTLS Authentication** | High Security / Banking | Mutual TLS client certificate verified at customer edge network and forwarded with `cname-api-key`, `client-certificate`, `client-certificate-ca-verified` headers. |

---

## 2. Complete Flow Matrix

### 1. Authorization Code Flow (Server-Side Web Apps)
* **RFC**: RFC 6749 §4.1
* **Endpoints**: `GET /authorize`, `POST /oauth/token`, `GET /userinfo`
* **Grant / Response Type**: `response_type=code` & `grant_type=authorization_code`
* **Transport**:
```http
POST https://{yourDomain}/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "code": "AUTH_CODE",
  "redirect_uri": "https://displaycellpros.com/api/auth/callback"
}
```

---

### 2. Authorization Code with PKCE (SPAs & Mobile Apps)
* **RFC**: RFC 7636 (Proof Key for Code Exchange)
* **Endpoints**: `GET /authorize`, `POST /oauth/token`
* **Security**: Cryptographically eliminates authorization code interception attacks for clients that cannot store secrets.
* **Handshake**:
  1. Generate high-entropy `code_verifier` and compute `code_challenge = BASE64URL(SHA256(code_verifier))`.
  2. Redirect browser to `/authorize?response_type=code&code_challenge=...&code_challenge_method=S256`.
  3. Exchange returned `code` with plain `code_verifier` at `/oauth/token`.

---

### 3. Client Credentials Flow (Machine-to-Machine / Daemons)
* **RFC**: RFC 6749 §4.4
* **Endpoints**: `POST /oauth/token`
* **Payload**:
```json
{
  "grant_type": "client_credentials",
  "client_id": "M2M_CLIENT_ID",
  "client_secret": "M2M_CLIENT_SECRET",
  "audience": "https://api.displaycellpros.com"
}
```

---

### 4. Device Authorization Flow (Smart TVs, IoT, CLIs)
* **RFC**: RFC 8628
* **Endpoints**: `POST /oauth/device/code`, `POST /oauth/token`
* **Flow**:
  1. Device calls `/oauth/device/code` to receive `device_code`, `user_code`, `verification_uri`.
  2. User inputs code on a secondary smartphone/browser (`/activate`).
  3. Device polls `/oauth/token` until authorized.

---

### 5. Passwordless Authentication (SMS / Email OTP & Magic Link)
* **Specification**: Auth0 Passwordless
* **Endpoints**: `POST /passwordless/start`, `POST /oauth/token`
* **OTP Verification**:
```json
{
  "grant_type": "http://auth0.com/oauth/grant-type/passwordless/otp",
  "client_id": "YOUR_CLIENT_ID",
  "username": "user@displaycellpros.com",
  "otp": "849201",
  "realm": "email",
  "scope": "openid profile email"
}
```

---

### 6. Private Key JWT (Client Assertion)
* **RFC**: RFC 7521 & RFC 7523
* **Endpoints**: `POST /oauth/token`
* **Payload**:
```json
{
  "grant_type": "client_credentials",
  "client_id": "YOUR_CLIENT_ID",
  "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  "client_assertion": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjcC0yMDI2In0...",
  "audience": "https://api.displaycellpros.com"
}
```

---

### 7. mTLS Client Certificate Authentication
* **RFC**: RFC 8705
* **Forwarding Headers**:
  * `cname-api-key`: Custom domain API Key
  * `client-certificate`: URL-encoded X.509 client certificate
  * `client-certificate-ca-verified`: `SUCCESS` | `FAILED`

---

### 8. Refresh Token Rotation & Revocation
* **RFC**: RFC 6749 §6 & RFC 7009
* **Token Rotation**: `POST /oauth/token` with `grant_type=refresh_token`. Invalidation detection automatically revokes compromised token trees.
* **Token Revocation**: `POST /oauth/revoke` with `{ "client_id": "...", "token": "..." }`.

---

### 9. Enhanced Privacy (RAR, PAR, JAR)
* **RFCs**: RFC 9396 (RAR), RFC 9126 (PAR), RFC 9101 (JAR)
* **Endpoints**: `POST /oauth/par`, `GET /authorize?client_id=...&request_uri=...`
* Eliminates sensitive data exposure in browser history and query strings.

---

### 10. Client-Initiated Backchannel (CIBA)
* **Standard**: OpenID Foundation CIBA Core 1.0
* **Endpoints**: `POST /bc-authorize`, `POST /oauth/token`
* Initiates push-notification authentication to a user's mobile device from a POS register or call center.

---

### 11. UserInfo & Claims Introspection
* **Standard**: OpenID Connect Core 1.0 §5.3
* **Endpoint**: `GET /userinfo`
* **Header**: `Authorization: Bearer <access_token>`

---

### 12. Universal & Federated Logout
* **Standard**: OpenID RP-Initiated Logout
* **Endpoint**: `GET /v2/logout?client_id=...&returnTo=https://displaycellpros.com`

---

## 3. Rate Limiting & Error Code Guide

### Headers
* `X-RateLimit-Limit`: Maximum requests permitted per window.
* `X-RateLimit-Remaining`: Remaining request quota.
* `X-RateLimit-Reset`: Unix epoch timestamp when rate limit credits reset.

### Standard OAuth 2.0 Error Codes
* `400 invalid_request`: Missing required parameters (e.g. `code_verifier`).
* `401 invalid_client`: Invalid `client_secret` or expired Private Key assertion.
* `403 access_denied`: Insufficient user roles or RBAC permissions.
* `429 too_many_requests`: Exceeded rate limit thresholds.
* `500 server_error`: Upstream identity provider failure. Check [status.auth0.com](https://status.auth0.com/).

---

## 4. MCP Server & Tooling Integration

Configure the Auth0 MCP server in your `.cursor/mcp.json` or AGY sidecar:

```json
{
  "mcpServers": {
    "auth0": {
      "command": "npx",
      "args": ["-y", "@auth0/auth0-mcp-server", "run"],
      "capabilities": ["tools"],
      "env": {
        "DEBUG": "auth0-mcp"
      }
    }
  }
}
```
