-- Reset the database by dropping all tables. Development and testing purposes only. Use with caution.

BEGIN;

-- App tables (children first)
DROP TABLE IF EXISTS message CASCADE;
DROP TABLE IF EXISTS connection CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- better-auth tables
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS verification CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

COMMIT;