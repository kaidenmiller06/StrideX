/**
 * Server-side types for the response from the profile API.
 */
export type ProfileData = {
  name: string;
  image: string | null;
  username: string;
  bio: string | null;
  tags: string[];
};

/**
 * Client-side types for the post data used in the profile form.
 */
export type ProfileFormData = {
  username: string;
  bio: string;
  tags: string[];
};

export type ProfileFormProps = {
  profile: ProfileData | null;
  onSave: (data: ProfileFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  error?: string | null;
  saving?: boolean;
};