# StrideX REST API

Base URL: `/api`. All request and response bodies are JSON.
Authentication uses a session cookie from better-auth (`/api/auth/*`).
Errors always look like `{ "error": "message" }`.

## Connection
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/connection | Yes | All of the current user's connection |
| POST | /api/connection/:recipientId | Yes | Send a connection request |
| PATCH | /api/connection/:requesterId | Yes | Accept a pending connection request |
| DELETE | /api/connection/cancel/:requesterId | Yes | Cancel a pending connection request |
| DELETE | /api/connection/reject/:requesterId | Yes | Reject a pending connection request |
| DELETE | /api/connection/remove/:otherId | Yes | Remove an accepted connection |

`:recipientId`, `:requesterId` and `:otherId` are user ids (`profile.userId`), not usernames.

### GET /api/connection
200 `{ "connections": [{ "id", "status", "requesterId", "recipientId", "userId", "username", "name", "image" }] }`
where `userId`, `username`, `name` and `image` describe the *other* user.

### POST /api/connection/:recipientId
Requires the caller to have a profile. If the recipient already sent you a request, this
accepts it instead of creating a new one.

| Status | Body | Meaning |
|---|---|---|
| 201 | `{ "status": "pending" }` | Request created |
| 200 | `{ "status": "accepted" }` | Their pending request to you was accepted |
| 409 | `{ "error", "status": "pending" }` | You already sent a request |
| 409 | `{ "error", "status": "accepted" }` | Already connected |
| 400 | `{ "error" }` | Missing id, or you tried to connect with yourself |
| 403 | `{ "error" }` | You have no profile |
| 404 | `{ "error" }` | Recipient has no profile |
| 401 | `{ "error" }` | Not logged in |

### PATCH /api/connection/:requesterId
200 `{ "status": "accepted" }`, 404 no pending request from that user, 401 not logged in.

### DELETE /api/connection/cancel/:requesterId, DELETE /api/connection/reject/:requesterId, DELETE /api/connection/remove/:otherId
204 no body, 404 no matching pending or accepted connection, 401 not logged in.

## Profile

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/profile/me | Yes | Current user's profile and account |
| PUT | /api/profile/me | Yes | Create or update current user's profile |
| GET | /api/profile/:username | No | Public profile and account by username |

### GET /api/profile/me
200 `{ "profile": {...} | null }`, 401 not logged in.

### PUT /api/profile/me
Request body:

```json
{ "username": "johndoe", "bio": "It's clobberin' time!", "tags": ["Track", "5K", "10K"] }
```

Responses: 200 `{ "profile": {...} }`, 401 not logged in,
409 username taken, 422 invalid input.

### GET /api/profile/:username
200 `{ "profile": {...}, "connectionStatus": ... }`, 404 not found.

`connectionStatus` is `"none"`, `"outgoing"` (you sent a request), `"incoming"` (they sent
you one) or `"connected"`. It is `null` when logged out or viewing your own profile.

A profile looks like:

```json
{ "userId": "...", "username": "johndoe", "name": "John Doe", "image": null, "bio": "...", "tags": ["5K"] }
```

## User

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/me | Yes | Current user's account |
| DELETE | /api/me | Yes | Delete the current user's profile, connections, and account |

- GET 200 `{ "account": {...} }`, 401 not logged in
- DELETE 204 or 200, 401 not logged in