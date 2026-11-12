import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getUserById,
  deleteUser
} from '../queries/user.js';

const router = Router();


// -----------------------------------------------------
// User routes
// -----------------------------------------------------

// GET/api/me - Get the current authenticated user's account information
router.get("/", requireAuth, async (req, res) => {
  const result = await getUserById(res.locals.userId);
  if (!result) return res.status(404).json({ error: "User not found" });
  res.json({ user: result });
});

// DELETE/api/me - Delete the current authenticated user's account and profile
router.delete('/', requireAuth, async (req, res) => {
  const deleted = await deleteUser(res.locals.userId);
  if (!deleted) return res.status(404).json({ error: "User not found" });
  res.status(204).send();
});


export default router;