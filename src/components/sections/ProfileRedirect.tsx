import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../lib/authClient';
import { fetchMyProfile } from '../../lib/fetchMyProfile';

/**
 * ProfileRedirect component that redirects the user to their own profile page or the profile setup page based on whether they have a profile set up.
 */
function ProfileRedirect() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      navigate('/auth', { replace: true });
      return;
    }
    
    fetchMyProfile()
      .then((profile) => {
        navigate(profile ? `/profile/${profile.username}` : '/profile/setup', { replace: true });
      })
      .catch(() => navigate('/auth', { replace: true }));
  }, [navigate]);

  return null;
}

export default ProfileRedirect;