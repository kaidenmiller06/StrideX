import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Person, SendFill } from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';

import Header from './Header';
import ProfileForm from '../ui/ProfileForm';
import Button from '../ui/Button';
import SwapLabel from '../ui/SwapLabel';

import { useRequireProfile } from '../../hooks/useRequireProfile';
import { authClient } from '../../lib/authClient';
import type { ProfileData, ProfileFormData } from '../../types/profile';
import type { ConnectionAction, ConnectionStatus } from '../../types/connection';

type ActionConfig = {
  url: (id: string) => string;
  method: 'POST' | 'PATCH' | 'DELETE';
  next: ConnectionStatus;
  success: string;
};

const ACTIONS: Record<ConnectionAction, ActionConfig> = {
  connect: { url: (id) => `/api/connection/${id}`,        method: 'POST',   next: 'outgoing',  success: 'Request sent' },
  accept:  { url: (id) => `/api/connection/${id}`,        method: 'PATCH',  next: 'connected', success: 'Connection accepted' },
  cancel:  { url: (id) => `/api/connection/cancel/${id}`, method: 'DELETE', next: 'none',      success: 'Request canceled' },
  remove:  { url: (id) => `/api/connection/remove/${id}`, method: 'DELETE', next: 'none',      success: 'Connection removed' },
  reject:  { url: (id) => `/api/connection/reject/${id}`, method: 'DELETE', next: 'none',      success: 'Request rejected' },
};

const popIn = 'animate-pop-in motion-reduce:animate-none';
const hoverDanger = 'hover:border-red-500 hover:text-red-400 hover:bg-red-500/10 focus-visible:outline-red-500';

/**
 * Profile component that displays a user's profile information and allows editing if it's the current user's profile. 
 */
function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const requireProfile = useRequireProfile();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('none');
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);

  const [pending, setPending] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  // Determine if the profile being viewed belongs to the current authenticated user
  const isOwn = !!session && !!profile && profile.userId === session.user.id;


  // -----------------------------------------------------
  // Profile Data Fetching
  // -----------------------------------------------------

  // Fetch the profile data for the given username when the component mounts or when the username changes.
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setEditing(false);

    // Fetch a user's profile data from the server. If no username is provided, fetch the current user's profile.
    fetch(`/api/profile/${encodeURIComponent(username!)}`)
      .then(async (r) => {
        if (r.status === 404) return { profile: null, connectionStatus: null };
        if (!r.ok) throw new Error(`Profile request failed: ${r.status}`);
        return r.json();
      })
      .then(({ profile, connectionStatus }) => {
        if (cancelled) return;

        // Redirect to home if profile is not found
        if (!profile) {
          toast.error('User not found', { id: 'profile-error' });
          navigate('/', { replace: true });
          return;
        }

        setProfile(profile);
        setConnectionStatus(connectionStatus);
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
  }, [username, session?.user.id, isPending]);

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


  // -----------------------------------------------------
  // Connection Handling
  // -----------------------------------------------------

  const handleConnectionAction = async (name: ConnectionAction) => {
    if (pending) return; // ignore double clicks

    if (!session) {
      navigate('/auth');
      toast.error('You must be logged in to connect with other users', { id: 'connection-error' });
      return;
    }

    const action = ACTIONS[name];
    const id = profile!.userId;
    const prev = connectionStatus;

    setConfirmRemove(false);
    setPending(name);

    try {
      setConnectionStatus(action.next);

      const res = await fetch(action.url(id), { method: action.method, credentials: 'include' });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(action.success, { id: 'connection-success' });
      } else if (res.status == 409 && body.status) {
        setConnectionStatus(body.status === 'accepted' ? 'connected' : 'outgoing');
      } else if (res.status == 404) {
        setConnectionStatus('none');
        toast.error('That request no longer exists', { id: 'connection-error' });
      } else {
        setConnectionStatus(prev);
        toast.error(body.error || 'An error occurred', { id: 'connection-error' });
      }
    } catch {
      setConnectionStatus(prev);
      toast.error('Something went wrong, pleast try again', { id: 'connection-error' });
    } finally {
      setPending(null);
    }
  }

  useEffect(() => {
    if (!confirmRemove) return;
    const t = setTimeout(() => setConfirmRemove(false), 3000);
    return () => clearTimeout(t);
  }, [confirmRemove]);

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
        <Header highlightProfile={isOwn} />
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
                          <Button variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
                        ) : (
                          <>
                            {(!connectionStatus || connectionStatus === 'none') && (
                              <Button variant="primary" loading={pending === 'connect'} onClick={() => handleConnectionAction('connect')}>
                                Connect
                              </Button>
                            )}

                            {connectionStatus === 'outgoing' && (
                              <Button variant="outline" className={popIn} onClick={() => handleConnectionAction('cancel')}>
                                Requested
                              </Button>
                            )}

                            {connectionStatus === 'incoming' && (
                              <>
                                <Button variant="primary" loading={pending === 'accept'} onClick={() => handleConnectionAction('accept')}>
                                  Accept
                                </Button>
                                <Button variant="danger" className={`${popIn}`} loading={pending === 'reject'}
                                  onClick={() => handleConnectionAction('reject')}>
                                  Reject
                                </Button>
                              </>
                            )}

                            {connectionStatus === 'connected' && (
                              <>
                                <Button
                                  variant={confirmRemove ? 'danger' : 'default'}
                                  className={confirmRemove ? '' : hoverDanger}
                                  onClick={() => (confirmRemove ? handleConnectionAction('remove') : setConfirmRemove(true))}
                                  onBlur={() => setConfirmRemove(false)}
                                >
                                  <SwapLabel idle="Connected" hover="Remove" active="Confirm?" isActive={confirmRemove} />
                                </Button>
                                <Button aria-label="Message" className={popIn} onClick={() => navigate(`/chat/${profile?.username}`)}>
                                  <SendFill size={20} />
                                </Button>
                              </>
                            )}
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