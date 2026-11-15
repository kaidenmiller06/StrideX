import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Person } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";

import FormInput from "./FormInput";
import type { ProfileFormProps } from "../../types/profile";
import { authClient } from "../../lib/authClient";
import { handleInvalid } from "../../lib/formValidation";

function ProfileForm({ profile, onSave, onCancel, canDelete }: ProfileFormProps) {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>(profile?.username ?? '');
  const [bio, setBio] = useState<string>(profile?.bio ?? '');
  const [tags, setTags] = useState<string[]>(profile?.tags ?? []);

  const [saving, setSaving] = useState(false);

  /**
   * Save the profile data to the server and call the onSave callback with the updated data.
   * @param e - The form submission event.
   */
  const submitProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, tags }),
      });

      // If the user is not authenticated, redirect to the auth page.
      if (res.status === 401) {
        toast.error(
          "You must be signed in to save your profile",
          { id: 'profile-error' }
        );
        navigate("/auth");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(
          body?.error ?? "Could not save profile",
          { id: 'profile-error' }
        );
        return;
      }

      const { profile: saved } = await res.json();
      toast.success("Profile saved", { id: 'profile-success' });
      onSave(saved);
    } catch {
      toast.error(
        "Network error, please try again",
        { id: 'profile-error' }
      );
    } finally {
      setSaving(false);
    }
  }
  
  /**
   * Delete the current user's account and profile. Signs the user out and redirects to the home page.
   */
  const deleteAccount = async () => {
    if (!confirm("Delete your account? Your profile and login will be permanently removed. This cannot be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error(`Delete request failed: ${res.status}`);

      // Ensure user is no longer authenticated after account deletion
      try {
        await authClient.signOut();
      } catch {
        console.error("Failed to sign out after account deletion");
      }

      toast.success("Account deleted", { id: 'profile-success' });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to delete account. Please try again.",
        { id: 'profile-error' }
      );
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 bg-stridex-grey">
      <form
        onSubmit={submitProfile} onInvalidCapture={handleInvalid}
        className="mx-auto mt-10 flex max-w-sm flex-col gap-3 rounded-2xl bg-stridex-black p-6 text-white"
      >
        <div className="flex flex-col gap-2 mb-4">
          {/* Form Header */}
          <div className="flex flex-row gap-2 mb-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">
                {profile ? "Edit Profile" : "Create Profile"}
              </h1>
              <p className="text-sm">
                {profile ? "Update your profile information below." : "Tell us a bit about yourself to get started."}
              </p>
            </div>

            {/* TODO: put in upload button to connect to image upload functionality */}
            <div className="flex flex-col gap-2">
              {/* <img src="path/to/image.jpg" alt="Profile Image" /> */}
              <Person size={100} className="shrink-0 text-stridex-lightgrey" />
            </div>
          </div>

          {/* Form inputs */}
          <FormInput id="username" label="Username" type="text" placeholder="Enter Username"
            value={username} onChange={(e) => setUsername(e.target.value)}
            required pattern="[a-zA-Z0-9_]{3,20}" title="3-20 letters, numbers, or underscores" />

          <FormInput id="bio" label="Bio" multiline placeholder="Enter User Bio"
            value={bio ?? ''} onChange={(e) => setBio(e.target.value)}
            maxLength={150} />

          <FormInput id="tags" label="Tags" type="text" placeholder="Enter Tags (comma-separated)"
            value={tags.join(', ')} onChange={(e) => setTags(e.target.value.split(',').map((t) => t.trim()))}
            maxLength={100} />
          
          {/* Action buttons */}
          {onCancel && <button type="button" onClick={onCancel}
            className="rounded-full bg-stridex-grey mt-2 px-4 py-2 font-semibold hover:bg-stridex-black-hover">
            Cancel
          </button>}

          <button type="submit" disabled={saving}
            className="rounded-full bg-stridex-green mt-2 px-4 py-2 font-semibold hover:bg-stridex-green-hover disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {canDelete && <button type="button" onClick={deleteAccount} disabled={saving}
            className="rounded-full bg-red-500 mt-2 px-4 py-2 font-semibold hover:bg-red-600 disabled:opacity-50">
            Delete Account
          </button>}
        </div>
      </form>
    </main>
  );
}

export default ProfileForm;