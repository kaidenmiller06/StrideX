import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getProfileByUserId,
  getProfileByUsername,
  updateProfile
} from '../queries/profile.js';

const router = Router();

// Reserved usernames that cannot be used for profiles
const RESERVED_USERNAMES = new Set([
  'me', 'admin', 'auth', 'events', 'connections', 'store', 'api'
]);


// -----------------------------------------------------
// Profile routes
// -----------------------------------------------------

// GET/api/profile/me - Get the current authenticated user's profile and account
router.get('/me', requireAuth, async (req, res) => {
  const profile = await getProfileByUserId(res.locals.userId);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json({ profile });
});

// PUT/api/profile/me - Update the current authenticated user's profile
router.put('/me', requireAuth, async (req, res) => {
  const { username, bio, tags } = req.body;

  // Confirm username is 3-20 characters, alphanumeric or underscores, and not reserved
  if (typeof username !== "string" || !/^[a-zA-Z0-9_]{3,20}$/.test(username)
    || RESERVED_USERNAMES.has(username.toLowerCase())) {
    return res.status(422).json({ error: "Username must be 3-20 letters, numbers, or underscores" });
  }

  // Confirm tags array is only strings and trim whitespace
  const clean = (arr: unknown): string[] =>
    Array.isArray(arr)
      ? arr.filter((s): s is string => typeof s === "string" && s.trim() !== "").map((s) => s.trim())
      : [];

  const cleanTags = clean(tags);

  const profile = await updateProfile(res.locals.userId, username, (bio || null), cleanTags);
  res.status(200).json({ profile });
});

// GET/api/profile/:username - Get a user's profile and account by username
router.get('/:username', async (req, res) => {
  const profile = await getProfileByUsername(req.params.username);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json({ profile });
});


export default router;