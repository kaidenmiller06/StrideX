import { pool } from "../db/pool.js";

/**
 * Retrieves the account information for a given user ID.
 * @param userId - The ID of the user whose account information is being retrieved
 * @returns Account information if found, otherwise null
 */
export async function getUserById(userId: string) {
  const result = await pool.query(
    'SELECT id, name, email, image, "createdAt" FROM "user" WHERE id = $1',
    [userId]
  );
  return result.rows[0] ?? null;
}

/**
 * Deletes the profile and account for a given user ID.
 * @param userId - The ID of the user whose profile and account is being deleted
 * @returns True if the user was deleted, otherwise false
 */
export async function deleteUser(userId: string) {
  const { rowCount } = await pool.query(
    'DELETE FROM "user" WHERE id = $1;',
    [userId]
  );
  return rowCount === 1;
}