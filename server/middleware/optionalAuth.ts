import type { RequestHandler } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth.js';

/**
 * If the user is authenticated, attaches the session and user ID to res.locals.
 * If not authenticated, simply calls next() without attaching anything.
 * @params req - The Express request object
 * @params res - The Express response object
 * @params next - The next middleware function
 */
export const optionalAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (session) {
      res.locals.session = session;
      res.locals.userId = session.user.id;
    }
    next();
  } catch (err) {
    next(err);
  }
};