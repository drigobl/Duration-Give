import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CharityDetails } from '@/types/charity';

interface ProfileFormProps {
  profile: Partial<CharityDetails>;
  onSubmit: (data: CharityDetails) => Promise<void>;
  loading: boolean;
  error?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  loading,
  error
}) => {
  const [formData, setFormData] = React.useState<CharityDetails>({
    name: profile.name || '',
    description: profile.description || '',
    category: profile.category || '',
    image_url: profile.image_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md">{error}</div>
      )}
      <Input
        label="Charity Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50"
          required
        />
      </div>
      <Input
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        required
      />
      <Input
        label="Image URL"
        type="url"
        value={formData.image_url}
        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
        required
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default ProfileForm;