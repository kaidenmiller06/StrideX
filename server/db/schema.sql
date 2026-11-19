CREATE TABLE profile (
  user_id     text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  username    text UNIQUE NOT NULL,
  bio         text,
  tags        text[] DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX profile_username_lower_idx ON profile (lower(username));

CREATE TABLE connection (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
  recipient_id  TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at  TIMESTAMPTZ,
  CHECK (requester_id <> recipient_id)
);

-- guaruntee only one connection between 2 users
CREATE UNIQUE INDEX connection_pair_unique
  ON connection (LEAST(requester_id, recipient_id), GREATEST(requester_id, recipient_id));

CREATE INDEX connection_recipient_idx ON connection (recipient_id, status);

CREATE TABLE message (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id  UUID NOT NULL REFERENCES connection(id) ON DELETE CASCADE,
  sender_id      TEXT NOT NULL REFERENCES profile(user_id) ON DELETE CASCADE,
  text           TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX message_connection_idx ON message (connection_id, created_at);