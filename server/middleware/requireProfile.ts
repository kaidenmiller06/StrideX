
import type { RequestHandler } from 'express';
import { getProfileByUserId } from "../queries/profile.js";

/**
 * Must run after requireAuth. Rejects users who haven't created a profile yet,
 * and attaches the profile to res.locals so handlers don't need to fetch it again.
 * @params req - The Express request object
 * @params res - The Express response object
 * @params next - The next middleware function
 */
export const requireProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await getProfileByUserId(res.locals.userId);
    if (!profile) return res.status(403).json({ error: "Create a profile first" });
  
    res.locals.profile = profile;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not verify profile" });
  }
}