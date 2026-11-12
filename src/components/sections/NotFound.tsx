import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Catch-all route: toasts an error and sends the user home.
 */
function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Page not found', { id: 'not-found' });
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}

export default NotFound;