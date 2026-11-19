import { pool } from "../db/pool.js";
import type { ConnectionStatus, ConnectResult } from "../../src/types/connection.js";

/**
 * Retrieves the connection status between two users.
 * @param userId - The ID of the first user
 * @param otherId - The ID of the second user
 * @returns A string indicating the connection status: 'none', 'outgoing', 'incoming', or 'connected'
 */
export async function getConnectionStatus(userId: string, otherId: string): Promise<ConnectionStatus> {
  const { rows } = await pool.query(
    `SELECT requester_id AS "requesterId", status
     FROM connection
     WHERE LEAST(requester_id, recipient_id) = LEAST($1::text, $2::text)
     AND GREATEST(requester_id, recipient_id) = GREATEST($1::text, $2::text)`,
    [userId, otherId]
  );
  const c = rows[0];
  if (!c) return 'none';
  if (c.status === 'accepted') return 'connected';
  return c.requesterId === userId ? 'outgoing' : 'incoming';
}

/**
 * Retrieves all connections for a given user ID,
 * including the connection status and the profile information of the other user in the connection.
 * @param userId - The ID of the user whose connections are being retrieved
 * @returns An array of connection objects, with connection and profile information for other users
 */
export async function getConnectionsByUserId(userId: string) {
  const result = await pool.query(
    `SELECT c.id, c.status,
     c.requester_id AS "requesterId", c.recipient_id AS "recipientId",
     p.user_id AS "userId", p.username, u.name, u.image
     FROM connection c
     JOIN profile p ON p.user_id = CASE WHEN c.requester_id = $1
                                        THEN c.recipient_id ELSE c.requester_id END
     JOIN "user" u ON u.id = p.user_id
     WHERE c.requester_id = $1 OR c.recipient_id = $1`,
    [userId]
  );
  return result.rows;
}

/**
 * Creates a new connection request between two users, or accepts an existing request if one exists.
 * @param requesterId - The ID of the user sending the connection request
 * @param recipientId- The ID of the user receiving the connection request
 * @returns String indicating the result of the operation: 'created', 'accepted', 'pending', or 'connected'
  */
export async function createConnection(requesterId: string, recipientId: string): Promise<ConnectResult> {
  // 1. Try to insert a new connection request. If it succeeds, return 'created'.
  const inserted = await pool.query(
    `INSERT INTO connection (requester_id, recipient_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [requesterId, recipientId]
  );
  if (inserted.rows[0]) return 'created';

  // 2. Check if a row already exists between these two users by looking for the requestor and recipient in that order.
  const { rows } = await pool.query(
    `SELECT requester_id AS "requesterId", status
     FROM connection
     WHERE LEAST(requester_id, recipient_id) = LEAST($1::text, $2::text)
     AND GREATEST(requester_id, recipient_id) = GREATEST($1::text, $2::text)`,
    [requesterId, recipientId]
  );
  const existing = rows[0];
  if (!existing) throw new Error('Connection disappeared mid-request'); // deleted between steps

  if (existing.status === 'accepted') return 'connected';
  if (existing.requesterId === requesterId) return 'pending'; // you already sent this one

  // 3. They requested you first, so your "Connect" click means accept.
  const ok = await acceptConnection(recipientId, requesterId);
  if (!ok) throw new Error('Connection changed mid-request');
  return 'accepted';
}

/**
 * Accepts a pending connection request between two users.
 * @param requesterId - The ID of the user who sent the connection request
 * @param recipientId - The ID of the user who is accepting the connection request
 * @returns A boolean indicating whether the connection was successfully accepted
 */
export async function acceptConnection(requesterId: string, recipientId: string) {
  const { rowCount } = await pool.query(
    `UPDATE connection
     SET status = 'accepted', responded_at = now()
     WHERE requester_id = $1 AND recipient_id = $2 AND status = 'pending'`,
    [requesterId, recipientId]
  );
  return rowCount === 1;
}

/**
 * Cancels a sent connection request between two users.
 * @param requesterId - The ID of the user who sent the connection request
 * @param recipientId - The ID of the user who is canceling the connection request
 * @returns A boolean indicating whether the connection was successfully canceled
 */
export async function cancelConnection(requesterId: string, recipientId: string) {
  return await rejectConnection(requesterId, recipientId);
}

/**
 * Rejects a pending connection request between two users.
 * @param requesterId - The ID of the user who sent the connection request
 * @param recipientId - The ID of the user who is rejecting the connection request
 * @returns A boolean indicating whether the connection was successfully rejected
 */
export async function rejectConnection(requesterId: string, recipientId: string) {
  const { rowCount } = await pool.query(
    `DELETE FROM connection
     WHERE requester_id = $1 AND recipient_id = $2 AND status = 'pending'`,
    [requesterId, recipientId]
  );
  return rowCount === 1;
}

/**
 * Removes an accepted connection for a given user ID, effectively "unfriending" the other user.
 * @param userId - The ID of the user whose connection is being removed
 * @param otherId - The ID of the other user in the connection
 * @returns A boolean indicating whether the connection was successfully removed
 */
export async function removeConnection(userId: string, otherId: string) {
  const { rowCount } = await pool.query(
    `DELETE FROM connection
     WHERE status = 'accepted'
     AND ((requester_id = $1 AND recipient_id = $2)
       OR (requester_id = $2 AND recipient_id = $1))`,
    [userId, otherId]
  );
  return rowCount === 1;
}