import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Person, SendFill } from 'react-bootstrap-icons';

import Header from './Header';
import ProfileForm from '../ui/ProfileForm';
import type { ProfileData, ProfileFormData } from '../../types/profile';
import { authClient } from '../../lib/authClient';

function Profile() {
  const { username } = useParams<{ username?: string }>();
  const isOwn = !username;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setError(null);

    fetch(isOwn ? '/api/profile/me' : `/api/profile/${encodeURIComponent(username!)}`)
      .then(async (r) => {
        if (r.status === 404) return { profile: null, notFound: true };
        if (!r.ok) throw new Error(`Profile request failed: ${r.status}`);
        return r.json();
      })
      .then(({ profile }) => {
        if (cancelled) return;
        setProfile(profile ?? null);
        setEditing(isOwn && !profile);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError(isOwn ? "Could not load your profile" : "Could not load this user's profile");
      })
      .finally(() => { if (!cancelled) setLoaded(true); });
    
    return () => { cancelled = true; };
  }, [username]);

  /**
   * Save the profile data to the server.
   * @param values - The profile form data to save.
   * @returns A promise that resolves when the save operation is complete.
   */
  const handleSave = async (values: ProfileFormData) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 401) {
        window.location.href = "/auth";
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Could not save profile");
        return;
      }

      const data = await res.json();
      setProfile(data.profile);
      setEditing(false);
    } catch {
      setError("Network error, please try again");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete your account? Your profile and login will be permanently removed. This cannot be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/me", { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error(`Delete request failed: ${res.status}`);

      try {
        await authClient.signOut();
      } catch {
        console.error("Failed to sign out after account deletion");
      }

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Failed to delete account. Please try again.");
      setSaving(false);
    }
  };

  if (!loaded) return null;
  if (error && !profile && !editing) return <p className="p-4">{error}</p>;
  if (!isOwn && !profile) return <p className="p-4">User not found</p>;

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-stridex-grey">
        <Header />
        {editing ? (
          <ProfileForm
            profile={profile}
            onSave={handleSave}
            onCancel={profile ? () => { setEditing(false); setError(null); } : undefined}
            onDelete={profile ? handleDelete : undefined}
            error={error}
            saving={saving}
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
                          <button
                            className="px-4 py-2 text-white rounded-full border border-white hover:bg-stridex-lightgrey focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-white transition-colors duration-300"
                            onClick={() => setEditing(true)}
                          >
                            Edit Profile
                          </button>
                        ) : (
                          <>
                            <button className="px-4 py-2 text-white rounded-full border border-white hover:bg-stridex-lightgrey focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-white transition-colors duration-300">
                              Connect
                            </button>

                            <button className="aspect-square inline-flex items-center justify-center p-2 text-white rounded-full border border-white hover:bg-stridex-lightgrey focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-white transition-colors duration-300">
                              <SendFill size={20} />
                            </button>
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