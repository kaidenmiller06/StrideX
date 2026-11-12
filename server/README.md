# StrideX REST API

Base URL: `/api`. All request and response bodies are JSON.
Authentication uses a session cookie from better-auth (`/api/auth/*`).
Errors always look like `{ "error": "message" }`.

## Profile

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/profile/me | Yes | Current user's profile and account |
| PUT | /api/profile/me | Yes | Create or update current user's profile |
| GET | /api/profile/:username | No | Public profile and account by username |

### PUT /api/profile/me
Request body:
{ "username": "johndoe", "bio": "Its clobberin' time!", "tags": ["Track", "5K", "10K"] }

Responses: 200 `{ "profile": {...} }`, 401 not logged in,
409 username taken, 422 invalid input

## User

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/me | Yes | Current user's account |
| DELETE | /api/me | Yes | Delete the current user's profile and account |

Responses: 200 `{ "account": {...} }`, 401 not logged in