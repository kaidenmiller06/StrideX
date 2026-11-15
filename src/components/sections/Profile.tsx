import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Person, SendFill } from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';

import Header from './Header';
import ProfileForm from '../ui/ProfileForm';
import Button from '../ui/Button';

import { useRequireProfile } from '../../hooks/useRequireProfile';
import { authClient } from '../../lib/authClient';
import type { ProfileData, ProfileFormData } from '../../types/profile';

/**
 * Profile component that displays a user's profile information and allows editing if it's the current user's profile. 
 */
function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const requireProfile = useRequireProfile();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);

  const isOwn = !!session && !!profile && profile.userId === session.user.id;

  // Fetch profile data when the component mounts or when the username changes.
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setEditing(false);

    // Fetch a user's profile data from the server. If no username is provided, fetch the current user's profile.
    fetch(`/api/profile/${encodeURIComponent(username!)}`)
      .then(async (r) => {
        if (r.status === 404) return { profile: null };
        if (!r.ok) throw new Error(`Profile request failed: ${r.status}`);
        return r.json();
      })
      .then(({ profile }) => {
        if (cancelled) return;

        // Redirect to home if profile is not found
        if (!profile) {
          toast.error('User not found', { id: 'profile-error' });
          navigate('/', { replace: true });
          return;
        }

        setProfile(profile);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        toast.error(
          isOwn ? "Could not load your profile" : "Could not load this user's profile",
          { id: 'profile-error' }
        );
        navigate('/', { replace: true });
      })
      .finally(() => { if (!cancelled) setLoaded(true); });
    
    return () => { cancelled = true; };
  }, [username]);

  /**
   * Updates the local state and navigates to the new profile URL if the username has changed.
   * @param saved - the saved profile data returned from the server after a successful save operation
   */
  const handleSave = (saved: ProfileFormData) => {
    setProfile({ ...profile!, ...saved });
    setEditing(false);
    if (saved.username !== profile!.username) {
      navigate(`/profile/${saved.username}`, { replace: true });
    }
  };

  /**
   * Handles the "Connect" button click.
   */
  const handleConnect = async () => {
    if (!session) {
      navigate('/auth');
      return;
    }

    try {
      const mine = await requireProfile();
      if (!mine) return;

      // send the connection request here
      console.log(`Sending connection request from ${mine.username} to ${profile!.username}`);
    } catch {
      toast.error('Something went wrong, please try again', { id: 'profile-error' });
    }
  };

  // Loading state: show only the header while the profile data is being fetched or if the profile is not found.
  if (!loaded || isPending || !profile) {
    return (
      <div className="flex min-h-dvh flex-col bg-stridex-grey">
        <Header />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-stridex-grey">
        <Header />
        {/* Show the profile form if editing, otherwise show the profile details */}
        {editing ? (
          <ProfileForm
            profile={profile}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            canDelete={isOwn}
          />
        ) : (
          <main className="flex-1">
            <div className="mx-auto grid max-w-7xl grid-cols-1 p-4 gap-4 md:grid-cols-2">
              {/* Profile Section */}
              <section className="min-w-0 overflow-y-auto">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex flex-row gap-4">
                    {profile?.image ? (
                      <img src={profile.image} alt={profile.name} className="h-[150px] w-[150px] rounded-full object-cover" />
                    ) : (
                      <Person size={150} className="text-stridex-lightgrey" />
                    )}

                    <div className="flex flex-col justify-between my-2">
                      <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-white">{profile?.name}</h1>
                        <p className="mb-2 text-stridex-lightgrey">@{profile?.username}</p>
                      </div>

                      <div className="flex flex-row gap-2">
                        {isOwn ? (
                          <Button onClick={() => setEditing(true)}>
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button onClick={handleConnect}>
                              Connect
                            </Button>

                            <Button>
                              <SendFill size={20} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-row justify-evenly my-2 gap-4">
                      {/* TODO: create api endpoints for marketplace posts and events */}
                      <p className="text-stridex-lightgrey">6 Posts</p>
                      <p className="mb-2 text-stridex-lightgrey">7 Events</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    {profile?.bio && <p className="mb-2 text-white">{profile?.bio}</p>}

                    {profile && profile.tags.length > 0 && (
                      <>
                        <p className="mb-2 text-white">Tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {profile?.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-semibold text-white bg-stridex-black rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Posts Section */}
                <div className="flex flex-row w-full gap-4">
                  <div className="aspect-square flex flex-col w-1/3 p-4 bg-stridex-black border border-stridex-lightgrey rounded-2xl text-white">Post</div>
                  <div className="aspect-square flex flex-col w-1/3 p-4 bg-stridex-black border border-stridex-lightgrey rounded-2xl text-white">Post</div>
                  <div className="aspect-square flex flex-col w-1/3 p-4 bg-stridex-black border border-stridex-lightgrey rounded-2xl text-white">Post</div>
                </div>
              </section>

              {/* Events Section */}
              <section className="min-w-0">
                <div className="flex flex-col w-full p-2 bg-stridex-black border border-stridex-lightgrey rounded-full text-white">Event</div>
              </section>
            </div>
          </main>
        )}
      </div>
    </>
  );
}

export default Profile;