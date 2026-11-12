import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

import Header from './sections/Header';
import { authClient, logoutState } from '../lib/authClient';

/**
 * ProtectedRoute component that checks if the user is authenticated before rendering the child routes.
 * If the user is not authenticated, they are redirected to the login page.
 */
function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || session) return;

    if (logoutState.intentional) {
      logoutState.intentional = false;
      return;
    }
    toast.error('You must be logged in to access this page', { id: 'protected-route-error' });
  }, [isPending, session]);

  // Loading state while checking authentication status
  if (isPending) {
    return (
      <div className="flex min-h-dvh flex-col bg-stridex-grey">
        <Header />
      </div>
    );
  };

  if (!session) return <Navigate to="/auth" replace />;

  return <Outlet />;
}

export default ProtectedRoute;