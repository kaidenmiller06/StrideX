import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireProfile } from '../middleware/requireProfile.js';
import {
  getConnectionsByUserId,
  createConnection,
  acceptConnection,
  cancelConnection,
  rejectConnection,
  removeConnection
} from '../queries/connection.js';

const router = Router();
router.use(requireAuth, requireProfile);


// -----------------------------------------------------
// Connection routes
// -----------------------------------------------------

// GET/api/connection - Get the current authenticated user's connections
router.get('/', async (req, res) => {
  try {
    const connections = await getConnectionsByUserId(res.locals.userId);
    res.status(200).json({ connections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch connections' });
  }
});

// POST/api/connection/:recipientId - Create a new connection request
router.post('/:recipientId', async (req, res) => {
  const { recipientId } = req.params;
  const userId = res.locals.userId;

  // Check that recipientId is provided and is not the same as the requester
  if (typeof recipientId !== 'string' || !recipientId) {
    return res.status(400).json({ error: 'recipientId is required' });
  } else if (recipientId === userId) {
    return res.status(400).json({ error: "You can't connect with yourself" });
  }

  try {
    const result = await createConnection(userId, recipientId);

    switch (result) {
      case 'created':   return res.status(201).json({ status: 'pending' });
      case 'accepted':  return res.status(200).json({ status: 'accepted' });
      case 'pending':   return res.status(409).json({ error: 'Request already sent', status: 'pending' });
      case 'connected': return res.status(409).json({ error: 'Already connected', status: 'accepted' });
      default: return res.status(500).json({ error: 'Unexpected result' });
    }
  } catch (err: any) {
    console.error(err);
    // Handle foreign key violation error (recipient has no profile)
    if (err.code === '23503') return res.status(404).json({ error: 'User not found' });

    res.status(500).json({ error: 'Could not create connection' });
  }
});

// PATCH/api/connection/:requesterId - Accept a connection request
router.patch('/:requesterId', async (req, res) => {
  const { requesterId } = req.params;

  // Check that requesterId is provided
  if (typeof requesterId !== 'string' || !requesterId) {
    return res.status(400).json({ error: 'requesterId is required' });
  }

  try {
    const accepted = await acceptConnection(requesterId, res.locals.userId);
    if (!accepted) return res.status(404).json({ error: "No pending request found" });
    res.status(200).json({ status: 'accepted' });
  } catch (err: any) {
    console.error(err);    
    res.status(500).json({ error: 'Could not accept connection' });
  }
});

// DELETE/api/connection/cancel/:recipientId - Cancel a sent connection request
router.delete('/cancel/:recipientId', async (req, res) => {
  const { recipientId } = req.params;

  // Check that recipientId is provided
  if (typeof recipientId !== 'string' || !recipientId) {
    return res.status(400).json({ error: 'recipientId is required' });
  }

  try {
    const deleted = await cancelConnection(res.locals.userId, recipientId);
    if (!deleted) return res.status(404).json({ error: "Connection not found" });
    res.status(204).end();
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Could not cancel connection' });
  }
});

// DELETE/api/connection/reject/:requesterId - Reject a connection request
router.delete('/reject/:requesterId', async (req, res) => {
  const { requesterId } = req.params;

  // Check that requesterId is provided
  if (typeof requesterId !== 'string' || !requesterId) {
    return res.status(400).json({ error: 'requesterId is required' });
  }

  try {
    const deleted = await rejectConnection(requesterId, res.locals.userId);
    if (!deleted) return res.status(404).json({ error: "Connection not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reject connection' });
  }
});

// DELETE/api/connection/remove/:otherId - Remove an accepted connection
router.delete('/remove/:otherId', async (req, res) => {
  const { otherId } = req.params;

  // Check that otherId is provided
  if (typeof otherId !== 'string' || !otherId) {
    return res.status(400).json({ error: 'otherId is required' });
  }

  try {
    const deleted = await removeConnection(res.locals.userId, otherId);
    if (!deleted) return res.status(404).json({ error: "Connection not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not remove connection' });
  }
});

export default router;