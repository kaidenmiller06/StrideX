import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from "better-auth/node";
import { auth } from '../auth.ts';

/**
 * Requires the user to be authenticated. If not, responds with a 401 Unauthorized error.
 * If authenticated, attaches the user ID to res.locals.userId and calls next().
 * @params req - The Express request object
 * @params res - The Express response object
 * @params next - The next middleware function
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) return res.status(401).json({ error: "Not logged in" });
  res.locals.userId = session.user.id;
  next();
}