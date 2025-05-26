import React, { useState } from 'react';
import { useCharityProfile } from '@/hooks/useCharityProfile';
import ProfileForm from './ProfileForm';
import CharityProfileCard from './CharityProfileCard';
import { Button } from '@/components/ui/Button';

const CharityProfileSection: React.FC = () => {
  const { profile, updateProfile, loading, error } = useCharityProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Charity Profile</h2>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Charity Profile</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="secondary"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {isEditing ? (
        <ProfileForm
          profile={profile}
          onSubmit={async (data) => {
            await updateProfile(data);
            setIsEditing(false);
          }}
          loading={loading}
          error={error}
        />
      ) : (
        <CharityProfileCard profile={profile} />
      )}
    </div>
  );
};

export default CharityProfileSection;