import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AlertCircle, CheckCircle, Edit2 } from 'lucide-react';

interface CharityDetails {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
}

interface ProfileUpdateApproval {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
  review_notes?: string;
}

export const ProfileUpdateRequest: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<CharityDetails | null>(null);
  const [updatedProfile, setUpdatedProfile] = useState<CharityDetails | null>(null);
  const [updateReason, setUpdateReason] = useState('');
  const [pendingRequest, setPendingRequest] = useState<ProfileUpdateApproval | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    'Education',
    'Health',
    'Environment',
    'Social Services',
    'Animal Welfare',
    'Arts & Culture',
    'Other'
  ];

  useEffect(() => {
    loadCharityProfile();
  }, [user]);

  const loadCharityProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get charity details
      const { data: charityData, error: charityError } = await supabase
        .from('charity_details')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (charityError) throw charityError;

      setCurrentProfile(charityData);
      setUpdatedProfile(charityData);

      // Check for pending update request
      const { data: pendingData } = await supabase
        .from('profile_update_approvals')
        .select('*')
        .eq('charity_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (pendingData) {
        setPendingRequest(pendingData);
      }
    } catch (error) {
      console.error('Error loading charity profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!user || !currentProfile || !updatedProfile) return;

    // Check if any changes were made
    const hasChanges = 
      currentProfile.name !== updatedProfile.name ||
      currentProfile.description !== updatedProfile.description ||
      currentProfile.category !== updatedProfile.category ||
      currentProfile.image_url !== updatedProfile.image_url;

    if (!hasChanges) {
      alert('No changes were made to submit.');
      return;
    }

    if (!updateReason.trim()) {
      alert('Please provide a reason for the update.');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('profile_update_approvals')
        .insert({
          charity_id: user.id,
          current_name: currentProfile.name,
          current_description: currentProfile.description,
          current_category: currentProfile.category,
          current_image_url: currentProfile.image_url,
          new_name: updatedProfile.name !== currentProfile.name ? updatedProfile.name : null,
          new_description: updatedProfile.description !== currentProfile.description ? updatedProfile.description : null,
          new_category: updatedProfile.category !== currentProfile.category ? updatedProfile.category : null,
          new_image_url: updatedProfile.image_url !== currentProfile.image_url ? updatedProfile.image_url : null,
          update_reason: updateReason,
          status: 'pending'
        });

      if (error) throw error;

      setShowSuccess(true);
      setIsEditing(false);
      setUpdateReason('');
      
      // Reload to show pending request
      loadCharityProfile();
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting update request:', error);
      alert('Failed to submit update request. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  if (!currentProfile) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">No charity profile found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <p className="text-green-800">
            Your profile update request has been submitted successfully. We'll review it shortly.
          </p>
        </div>
      )}

      {/* Pending Request Notice */}
      {pendingRequest && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-900">Pending Update Request</h3>
              <p className="text-yellow-700 mt-1">
                You have a profile update request pending review. Submitted on{' '}
                {new Date(pendingRequest.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Update Form */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile Update Request</h2>
          {!isEditing && !pendingRequest && (
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Request Update
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            {isEditing ? (
              <Input
                value={updatedProfile.name}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
                placeholder="Enter organization name"
              />
            ) : (
              <p className="text-gray-900">{currentProfile.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            {isEditing ? (
              <select
                value={updatedProfile.category}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 capitalize">{currentProfile.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={updatedProfile.description}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, description: e.target.value })}
                placeholder="Enter organization description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{currentProfile.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo/Image URL
            </label>
            {isEditing ? (
              <Input
                value={updatedProfile.image_url}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, image_url: e.target.value })}
                placeholder="Enter image URL"
                type="url"
              />
            ) : (
              <div>
                <p className="text-gray-900 mb-2">{currentProfile.image_url || 'No image set'}</p>
                {currentProfile.image_url && (
                  <img 
                    src={currentProfile.image_url} 
                    alt={currentProfile.name}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </div>

          {/* Update Reason */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Update <span className="text-red-500">*</span>
              </label>
              <textarea
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="Please explain why these changes are needed..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setUpdatedProfile(currentProfile);
                  setUpdateReason('');
                  setIsEditing(false);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitRequest}
                disabled={submitting || !updateReason.trim()}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Update Request'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};