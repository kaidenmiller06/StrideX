import { pool } from "../db/pool.js";

/**
 * Retrieves the profile and account for a given user ID.
 * @param userId - The ID of the user whose profile is being retrieved
 * @returns Profile and account if found, otherwise null
 */
export async function getProfileByUserId(userId: string) {
  const result = await pool.query(
    `SELECT p.*, u.name, u.image
     FROM profile p
     JOIN "user" u ON u.id = p.user_id
     WHERE p.user_id = $1`,
    [userId]
  );
  return result.rows[0] ?? null;
}

/**
 * Retrieves the profile and account for a given username.
 * @param username - The username of the user whose profile is being retrieved
 * @returns Profile and account if found, otherwise null
 */
export async function getProfileByUsername(username: string) {
  const result = await pool.query(
    `SELECT p.*, u.name, u.image
     FROM profile p
     JOIN "user" u ON u.id = p.user_id
     WHERE p.username = $1`,
    [username]
  );
  return result.rows[0] ?? null;
}

/**
 * Updates or creates a profile for a given user ID.
 * @param userId - The ID of the user whose profile is being updated
 * @param username - The new username for the profile
 * @param bio - The new bio for the profile, or null if not provided
 * @param tags - An array of tags associated with the profile
 * @returns Profile and account after the update, or null if the profile could not be found
 */
export async function updateProfile(userId: string, username: string, bio: string | null, tags: string[]) {
  await pool.query(
    `INSERT INTO profile (user_id, username, bio, tags)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE
     SET username = EXCLUDED.username, bio = EXCLUDED.bio, tags = EXCLUDED.tags`,
    [userId, username, bio, tags]
  );
  return getProfileByUserId(userId);
}