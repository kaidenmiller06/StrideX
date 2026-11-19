
import type { RequestHandler } from 'express';
import { fromNodeHeaders } from "better-auth/node";
import { auth } from '../auth.ts';

/**
 * Requires the user to be authenticated. If not, responds with a 401 Unauthorized error.
 * If authenticated, attaches the user ID to res.locals.userId and calls next().
 * @params req - The Express request object
 * @params res - The Express response object
 * @params next - The next middleware function
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) return res.status(401).json({ error: "Not logged in" });
    res.locals.userId = session.user.id;
    next();
  } catch (err) {
    next(err);
  }
}