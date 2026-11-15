import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import Header from '../sections/Header';
import { fetchMyProfile } from '../../lib/fetchMyProfile';

/**
 * Renders child routes only if the logged-in user has created a profile.
 * Otherwise redirects to the profile setup page.
 */
function ProfileRequired() {
  const [status, setStatus] = useState<'loading' | 'has' | 'none' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        if (!profile) toast.error('Create a profile to connect with other users', { id: 'profile-required' });
        setStatus(profile ? 'has' : 'none');
      })
      .catch(() => {
        if (cancelled) return;
        toast.error('Could not load your profile', { id: 'profile-error' });
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh flex-col bg-stridex-grey">
        <Header />
      </div>
    );
  }

  if (status === 'none') return <Navigate to="/profile/setup" replace />;
  if (status === 'error') return <Navigate to="/" replace />;

  return <Outlet />;
}

export default ProfileRequired;