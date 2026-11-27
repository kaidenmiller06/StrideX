import {Router} from 'express'
import type {RequestHandler} from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fromNodeHeaders} from 'better-auth/node'
import {auth} from '../auth' // use your real Better Auth import
import {listStoreItems, createStoreItem, deleteStoreItem} from '../queries/storeItem'
import fsSync from 'node:fs'

const router = Router()

// Allowing image types, the extension is chosen and how we save it
const EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}


// multer saves the uploaded fule 
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/store',
    filename: (_req, file, cb) => cb(null, crypto.randomUUID() + EXT[file.mimetype]),
  }),
  limits: {fileSize: 5 * 1024 * 1024},
  fileFilter: (_req, file, cb) => cb(null, file.mimetype in EXT),
})

const requireSession: RequestHandler = async (req, res, next) => {
  const session = await auth.api.getSession({headers: fromNodeHeaders(req.headers)})
  if (!session) return res.status(401).json({error: 'Unauthorized'})
  res.locals.userId = session.user.id
  next()
}

router.get('/api/store', async (_req, res) => {
  res.json({items: await listStoreItems()})
})


// users post the image
router.post('/api/store', requireSession, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({error: 'Please upload a JPG, PNG or WebP image.'})
  const caption = String(req.body.caption ?? '').slice(0, 200)
  const item = await createStoreItem(`/uploads/store/${req.file.filename}`, caption, res.locals.userId)
  res.status(201).json({item})
})

// makes it so only the owner can delete their item
router.delete('/api/store/:id', requireSession, async (req, res) => {
  const imagePath = await deleteStoreItem(Number(req.params.id), res.locals.userId)
  if (!imagePath) return res.status(404).json({error: 'Not found or not yours'})
  await fs.unlink(path.join(process.cwd(), imagePath)).catch(() => {})
  res.status(204).end()
})


fsSync.mkdirSync('uploads/store', {recursive: true})

export default router