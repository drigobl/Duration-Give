import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { User, Briefcase, Award, Calendar, Edit2, Save, X } from 'lucide-react';

interface VolunteerProfileData {
  id?: string;
  full_name: string;
  phone_number: string;
  date_of_birth: string;
  skills: string[];
  interests: string[];
  certifications: string[];
  experience: string;
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
  };
}

export const VolunteerProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<VolunteerProfileData>({
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    skills: [],
    interests: [],
    certifications: [],
    experience: '',
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false,
    },
  });

  const [editedProfile, setEditedProfile] = useState<VolunteerProfileData>(profile);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First check if volunteer profile exists
      const { data: existingProfile, error } = await supabase
        .from('volunteer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        setProfile({
          id: existingProfile.id,
          full_name: existingProfile.full_name || '',
          phone_number: existingProfile.phone_number || '',
          date_of_birth: existingProfile.date_of_birth || '',
          skills: existingProfile.skills || [],
          interests: existingProfile.interests || [],
          certifications: existingProfile.certifications || [],
          experience: existingProfile.experience || '',
          availability: existingProfile.availability || {
            weekdays: false,
            weekends: false,
            evenings: false,
          },
        });
        setEditedProfile(existingProfile);
      } else {
        // Get basic info from auth user
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user?.user_metadata) {
          setProfile(prev => ({
            ...prev,
            full_name: authUser.user.user_metadata.full_name || '',
          }));
          setEditedProfile(prev => ({
            ...prev,
            full_name: authUser.user.user_metadata.full_name || '',
          }));
        }
      }
    } catch (error) {
      console.error('Error loading volunteer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const profileData = {
        user_id: user.id,
        full_name: editedProfile.full_name,
        phone_number: editedProfile.phone_number,
        date_of_birth: editedProfile.date_of_birth,
        skills: editedProfile.skills,
        interests: editedProfile.interests,
        certifications: editedProfile.certifications,
        experience: editedProfile.experience,
        availability: editedProfile.availability,
        updated_at: new Date().toISOString(),
      };

      if (profile.id) {
        // Update existing profile
        const { error } = await supabase
          .from('volunteer_profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('volunteer_profiles')
          .insert([profileData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setProfile({ ...editedProfile, id: data.id });
        }
      }

      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving volunteer profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    setEditedProfile({ ...editedProfile, skills });
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(s => s.trim()).filter(s => s);
    setEditedProfile({ ...editedProfile, interests });
  };

  const handleCertificationsChange = (value: string) => {
    const certifications = value.split(',').map(s => s.trim()).filter(s => s);
    setEditedProfile({ ...editedProfile, certifications });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Volunteer Profile</h3>
        {!isEditing ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.full_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900">{profile.full_name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={editedProfile.phone_number}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone_number: e.target.value })}
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-900">{profile.phone_number || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedProfile.date_of_birth}
                  onChange={(e) => setEditedProfile({ ...editedProfile, date_of_birth: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">
                  {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Briefcase className="h-4 w-4 mr-2" />
            Skills & Experience
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="e.g., Web Development, Teaching, Marketing"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              {isEditing ? (
                <textarea
                  value={editedProfile.experience}
                  onChange={(e) => setEditedProfile({ ...editedProfile, experience: e.target.value })}
                  placeholder="Describe your relevant experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              ) : (
                <p className="text-gray-900">{profile.experience || 'No experience description provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Certifications & Interests */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Award className="h-4 w-4 mr-2" />
            Certifications & Interests
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certifications (comma-separated)
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.certifications.join(', ')}
                  onChange={(e) => handleCertificationsChange(e.target.value)}
                  placeholder="e.g., First Aid, Teaching Certificate"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.length > 0 ? (
                    profile.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {cert}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No certifications added</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests (comma-separated)
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.interests.join(', ')}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                  placeholder="e.g., Education, Environment, Healthcare"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No interests added</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Calendar className="h-4 w-4 mr-2" />
            Availability
          </h4>
          <div className="space-y-2">
            {['weekdays', 'weekends', 'evenings'].map((time) => (
              <label key={time} className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedProfile.availability[time as keyof typeof editedProfile.availability]}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      availability: {
                        ...editedProfile.availability,
                        [time]: e.target.checked,
                      },
                    })
                  }
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="capitalize">{time}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};