import { pool } from "../db/pool.js";

// Shape of a singular item
export type StoreItemRow = {
  id: number
  image: string  
  caption: string
  userID: string 
}


const COLUMNS = `id, image_url as "image", caption, user_id as "userID"`

// Returns every store item, newest first
export async function listStoreItems(): Promise<StoreItemRow[]> {
  const {rows} = await pool.query(
    `SELECT ${COLUMNS} FROM store_items ORDER BY created_at DESC`
  )
  return rows
}

// Inserts a new item and returns it
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

// Deletes an item only if it belongs to userId, makes sure the caller can delete the file from the disk, returns null if it's a missing item
export async function deleteStoreItem(id: number, userId: string): Promise<string | null> {
  const {rows} = await pool.query(
    'DELETE FROM store_items WHERE id = $1 AND user_id = $2 RETURNING image_url',
    [id, userId]
  )
  return rows[0]?.image_url ?? null
}