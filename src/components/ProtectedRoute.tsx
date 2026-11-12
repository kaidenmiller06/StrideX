import { Navigate, Outlet } from 'react-router-dom';
import { authClient } from '../lib/authClient';

function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null; // or a spinner; avoids redirecting before the session loads
  if (!session) return <Navigate to="/auth" replace />;

  return <Outlet />;
}

export default ProtectedRoute;