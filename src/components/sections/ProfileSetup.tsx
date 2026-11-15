import { useNavigate } from 'react-router-dom';

import Header from './Header';
import ProfileForm from '../ui/ProfileForm';
import type { ProfileFormData } from '../../types/profile';

 /**
  * ProfileSetup component that allows users to set up their profile after signing up.
  * It uses the ProfileForm component to collect user input and saves the profile data to the server.
  */
function ProfileSetup() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-stridex-grey">
      <Header />
      <ProfileForm
        onSave={(saved: ProfileFormData) => {
          navigate(`/profile/${saved.username}`, { replace: true });
        }}
      />
    </div>
  );
}

export default ProfileSetup;