import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authClient } from '../lib/authClient';
import { fetchMyProfile } from '../lib/fetchMyProfile';
import type { ProfileData } from '../types/profile';

/**
 * Returns a function that resolves to the current user's profile, or null if the user
 * isn't logged in or has no profile (in which case it redirects them appropriately).
 */
export function useRequireProfile() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  return async (): Promise<ProfileData | null> => {
    if (!session) {
      navigate('/auth');
      return null;
    }

    try {
      const profile = await fetchMyProfile();
      if (!profile) {
        toast('Create a profile to continue', { id: 'profile-error' });
        navigate('/profile/setup');
        return null;
      }
      return profile;
    } catch {
      toast.error('Something went wrong, please try again', { id: 'profile-error' });
      return null;
    }
  };
}