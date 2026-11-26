import { useEffect } from 'react';
import { socket } from '../lib/socket';
import { authClient } from '../lib/authClient';

/**
 * SocketManager component that manages the Socket.IO connection based on the user's authentication state.
 * It connects to the socket when the user is authenticated and disconnects when the user logs out or the component unmounts.
 */
function SocketManager() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    socket.connect();
    return () => { socket.disconnect(); };
  }, [userId]);

  return null;
}

export default SocketManager;