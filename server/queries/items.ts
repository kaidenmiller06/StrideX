import { pool } from "../db/pool.js";

export type StoreItemRow = {
  id: number
  image: string
  caption: string
  userID: string
}

const COLUMNS = `id, image_url AS "image", caption, user_id AS "userID"`

export async function listStoreItems(): Promise<StoreItemRow[]> {
  const {rows} = await pool.query(
    `SELECT ${COLUMNS} FROM store_items ORDER BY created_at DESC`
  )
  return rows
}

export async function createStoreItem(
  image: string,
  caption: string,
  userId: string
): Promise<StoreItemRow> {
  const {rows} = await pool.query(
    `INSERT INTO store_items (image_url, caption, user_id)
     VALUES ($1, $2, $3)
     RETURNING ${COLUMNS}`,
    [image, caption, userId]
  )
  return rows[0]
}

// Returns the deleted row's image path, or null if nothing matched
export async function deleteStoreItem(id: number, userId: string): Promise<string | null> {
  const {rows} = await pool.query(
    'DELETE FROM store_items WHERE id = $1 AND user_id = $2 RETURNING image_url',
    [id, userId]
  )
  return rows[0]?.image_url ?? null
}