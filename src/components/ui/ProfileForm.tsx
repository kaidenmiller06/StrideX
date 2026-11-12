import { useState } from "react";
import { Person } from "react-bootstrap-icons";

import FormInput from "./FormInput";
import type { ProfileFormProps } from "../../types/profile";
import { handleInvalid } from "../../lib/formValidation";

function ProfileForm({ profile, onSave, onCancel, onDelete, saving }: ProfileFormProps) {
  const [username, setUsername] = useState<string>(profile?.username ?? '');
  const [bio, setBio] = useState<string>(profile?.bio ?? '');
  const [tags, setTags] = useState<string[]>(profile?.tags ?? []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSave({ username, bio, tags });
  }

  return (
    <main className="flex-1 bg-stridex-grey">
      <form
        onSubmit={handleSubmit} onInvalidCapture={handleInvalid}
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

          {onDelete && <button type="button" onClick={onDelete} disabled={saving}
            className="rounded-full bg-red-500 mt-2 px-4 py-2 font-semibold hover:bg-red-600 disabled:opacity-50">
            Delete Account
          </button>}
        </div>
      </form>
    </main>
  );
}

export default ProfileForm;