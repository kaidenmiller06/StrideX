import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../../lib/fetchMyProfile';

/**
 * ProfileRedirect component that redirects the user to their own profile page or the profile setup page based on whether they have a profile set up.
 */
function ProfileRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile()
      .then((profile) => {
        navigate(profile ? `/profile/${profile.username}` : '/profile/setup', { replace: true });
      })
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return null;
}

export default ProfileRedirect;