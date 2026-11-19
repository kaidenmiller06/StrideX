import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

import {
  getProfileByUserId,
  getProfileByUsername,
  updateProfile
} from '../queries/profile.js';

import { getConnectionStatus } from '../queries/connection.js';
import type { ConnectionStatus } from '../../src/types/connection.js';

const router = Router();

// Reserved usernames that cannot be used for profiles
const RESERVED_USERNAMES = new Set([
  'me', 'admin', 'auth', 'events', 'connections', 'store', 'api', 'profile', 'setup'
]);


// -----------------------------------------------------
// Profile routes
// -----------------------------------------------------

// GET/api/profile/me - Get the current authenticated user's profile and account
router.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await getProfileByUserId(res.locals.userId);
    res.json({ profile: profile || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT/api/profile/me - Update the current authenticated user's profile
router.put('/me', requireAuth, async (req, res) => {
  const { username, bio, tags } = req.body;

  // Confirm username is not a reserved word
  if (RESERVED_USERNAMES.has(username.toLowerCase())) {
    return res.status(422).json({ error: "This username is reserved and cannot be used" });
  }

  // Confirm username is 3-20 characters using alphanumerics or underscores
  if (typeof username !== "string" || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
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
router.get('/:username', optionalAuth, async (req, res) => {
  if (typeof req.params.username !== 'string') {
    return res.status(400).json({ error: "Invalid username" });
  }

  const profile = await getProfileByUsername(req.params.username);
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  // Also fetch the connection status if the user is logged in and viewing another user's profile
  const session = res.locals.session;

  let connectionStatus: ConnectionStatus | null = null;
  if (session && session.user.id !== profile.userId) {
    connectionStatus = await getConnectionStatus(session.user.id, profile.userId);
  }

  res.json({ profile, connectionStatus });
});


export default router;