CREATE TABLE profile (
  user_id     text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  username    text UNIQUE NOT NULL,
  bio         text,
  tags        text[] DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX profile_username_lower_idx ON profile (lower(username));