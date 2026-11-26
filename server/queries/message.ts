import { pool } from "../db/pool.js";

/**
 * Retrieves the last 50 messages for a given connection between two users, ordered by creation time.
 * @param userId - The ID of the user requesting the messages
 * @param username - The username of the other user in the connection
 * @returns An array of message objects, each containing the message ID, sender ID, text, and creation time
 */
export async function getMessagesByConnection(userId: string, username: string) {
  const result = await pool.query(
    `SELECT m.id, m.sender_id AS "senderId", m.text, m.created_at AS "createdAt"
     FROM connection c
     JOIN profile p ON p.username = $2
     JOIN message m ON m.connection_id = c.id
     WHERE (c.requester_id = $1 AND c.recipient_id = p.user_id)
        OR (c.recipient_id = $1 AND c.requester_id = p.user_id)
     ORDER BY m.created_at DESC
     LIMIT 50`,
    [userId, username]
  );
  return result.rows.reverse();
}

/**
 * Sends a message from one user to another within an existing connection.
 * @param senderId - The ID of the user sending the message
 * @param recipientUsername - The username of the user receiving the message
 * @param text - The text content of the message
 * @returns An object containing the saved message details, including the recipient ID, or null if no connection exists
 */
export async function sendMessage(senderId: string, recipientUsername: string, text: string) {
  // find connection id and recipient id
  const conn = await pool.query(
    `SELECT c.id AS "connectionId", p.user_id AS "recipientId"
     FROM connection c
     JOIN profile p ON p.username = $2
     WHERE ((c.requester_id = $1 AND c.recipient_id = p.user_id)
        OR (c.recipient_id = $1 AND c.requester_id = p.user_id))
     LIMIT 1`,
    [senderId, recipientUsername]
  );
  if (conn.rows.length === 0) return null;
  const { connectionId, recipientId } = conn.rows[0];

  // save message to database and return the saved message with recipientId
  const result = await pool.query(
    `INSERT INTO message (connection_id, sender_id, text)
     VALUES ($1, $2, $3)
     RETURNING id, sender_id AS "senderId", text, created_at AS "createdAt"`,
    [connectionId, senderId, text]
  );

  return { ...result.rows[0], recipientId };
}