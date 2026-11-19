# CS341 - StrideX

## Databse Setup

Requires a running PostgreSQL database and a `.env` file with the following variables:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
BETTER_AUTH_SECRET=<your_secret_key>
BETTER_AUTH_URL=<your_app_url>
```

1. Install dependencies:

```bash
npm install
```

2. (Optional) Run the database reset script to clear all tables to reinitialize the database:

```bash
psql "$DATABASE_URL" -f server/db/reset.sql
```

3. Create better-auth tables:

```bash
npx @better-auth/cli migrate
```

4. Create the app tables:

```bash
psql "$DATABASE_URL" -f server/db/schema.sql
```