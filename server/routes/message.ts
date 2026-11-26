import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireProfile } from '../middleware/requireProfile.js';
import {
  getMessagesByConnection,
  sendMessage,
} from '../queries/message.js';
import { getIO } from '../socket.js';

const router = Router();
router.use(requireAuth, requireProfile);


// -----------------------------------------------------
// Message routes
// -----------------------------------------------------

// GET/api/message/:username - Get messages for a specific connection by username
router.get('/:username', async (req, res) => {
  try {
    const messages = await getMessagesByConnection(res.locals.userId, req.params.username);
    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

// POST/api/message/:username - Send a message to a specific connection by username
router.post('/:username', async (req, res) => {
  try {
    // Trim and validate message text length
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (text.length < 1 || text.length > 500) {
      return res.status(400).json({ error: 'Message text must be between 1 and 500 characters' });
    }

    const saved = await sendMessage(res.locals.userId, req.params.username, text);
    if (!saved) return res.status(404).json({ error: 'Connection not found.' });

    // Emit the new message to the recipient via Socket.IO
    const { recipientId, ...message } = saved;
    getIO().to(`user:${recipientId}`).emit('message:new', message);

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not send message' });
  }
});

export default router;