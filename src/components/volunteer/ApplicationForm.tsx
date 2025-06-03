import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logger } from '@/utils/logger';
import { validateEmail, validateName, validatePhoneNumber } from '@/utils/validation';
import { AlertCircle } from 'lucide-react';

interface ApplicationFormProps {
  opportunityId: string;
  opportunityTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  opportunityId,
  opportunityTitle,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    availability: {
      days: [] as string[],
      times: [] as string[]
    },
    commitmentType: 'short-term',
    experience: '',
    skills: '',
    certifications: '',
    interests: '',
    references: [
      { name: '', contact: '' },
      { name: '', contact: '' }
    ],
    workSamples: ''
  });

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'fullName':
        return validateName(value) ? '' : 'Please enter a valid name (2-100 characters)';
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email address';
      case 'phoneNumber':
        return validatePhoneNumber(value) ? '' : 'Please enter a valid phone number';
      case 'experience':
        return value.trim().length > 0 ? '' : 'Please provide information about your experience';
      default:
        return '';
    }
  };

  const handleInputChange = (
    field: string,
    value: string | string[] | { name: string; contact: string }[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setError('User profile not found');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      // Validate all required fields
      const errors: Record<string, string> = {};
      
      const fieldsToValidate = [
        { name: 'fullName', value: formData.fullName },
        { name: 'email', value: formData.email },
        { name: 'phoneNumber', value: formData.phoneNumber },
        { name: 'experience', value: formData.experience }
      ];
      
      fieldsToValidate.forEach(({ name, value }) => {
        const error = validateField(name, value);
        if (error) {
          errors[name] = error;
        }
      });
      
      // Check if availability is selected
      if (formData.availability.days.length === 0) {
        errors['availability.days'] = 'Please select at least one day';
      }
      
      if (formData.availability.times.length === 0) {
        errors['availability.times'] = 'Please select at least one time';
      }

      // If there are validation errors, don't submit
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        throw new Error('Please correct the validation errors');
      }

      Logger.info('Submitting volunteer application', {
        opportunityId,
        applicantId: profile.id
      });

      const { error: submitError } = await supabase
        .from('volunteer_applications')
        .insert({
          opportunity_id: opportunityId,
          applicant_id: profile.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          date_of_birth: formData.dateOfBirth || null,
          availability: {
            days: formData.availability.days,
            times: formData.availability.times
          },
          commitment_type: formData.commitmentType,
          experience: formData.experience,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          certifications: formData.certifications.split(',').map(c => c.trim()).filter(Boolean),
          interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
          reference_contacts: formData.references,
          work_samples: formData.workSamples.split(',').map(w => w.trim()).filter(Boolean)
        });

      if (submitError) throw submitError;

      Logger.info('Volunteer application submitted', {
        opportunityId,
        applicantId: profile.id
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit application';
      setError(message);
      Logger.error('Application submission failed', { error: err });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50 font-sans";
  const textareaClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50 font-sans";
  const selectClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-indigo-50 font-sans";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Apply for: {opportunityTitle}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <Input
                label="Full Name *"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
                className={inputClasses}             
                error={validationErrors['fullName']}
              />
              <Input
                label="Phone Number *"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
                className={inputClasses}
                error={validationErrors['phoneNumber']}
              />
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={inputClasses}
                error={validationErrors['email']}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Availability</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Days
                </label>
                {validationErrors['availability.days'] && (
                  <p className="text-sm text-red-600 mb-1">{validationErrors['availability.days']}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.availability.days.includes(day)}
                        onChange={(e) => {
                          const days = e.target.checked
                            ? [...formData.availability.days, day]
                            : formData.availability.days.filter(d => d !== day);
                          handleInputChange('availability', { ...formData.availability, days });
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Times
                </label>
                {validationErrors['availability.times'] && (
                  <p className="text-sm text-red-600 mb-1">{validationErrors['availability.times']}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {['Morning', 'Afternoon', 'Evening'].map(time => (
                    <label key={time} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.availability.times.includes(time)}
                        onChange={(e) => {
                          const times = e.target.checked
                            ? [...formData.availability.times, time]
                            : formData.availability.times.filter(t => t !== time);
                          handleInputChange('availability', { ...formData.availability, times });
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commitment Level
                </label>
                <select
                  value={formData.commitmentType}
                  onChange={(e) => handleInputChange('commitmentType', e.target.value)}
                  className={selectClasses}
                >
                  <option value="one-time">One-time</option>
                  <option value="short-term">Short-term</option>
                  <option value="long-term">Long-term</option>
                </select>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Skills & Experience</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Experience *
                </label>
                {validationErrors['experience'] && (
                  <p className="text-sm text-red-600 mb-1">{validationErrors['experience']}</p>
                )}
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  rows={4}
                  className={textareaClasses}
                  required
                />
              </div>
              <Input
                label="Skills (comma-separated)"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className={inputClasses}
              />
              <Input
                label="Certifications (comma-separated)"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Interests & Preferences</h3>
              <Input
                label="Areas of Interest (comma-separated)"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* References */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">References</h3>
              {formData.references.map((ref, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    label={`Reference ${index + 1} Name`}
                    value={ref.name}
                    onChange={(e) => {
                      const newRefs = [...formData.references];
                      newRefs[index] = { ...ref, name: e.target.value };
                      handleInputChange('references', newRefs);
                    }}
                    className={inputClasses}
                  />
                  <Input
                    label={`Reference ${index + 1} Contact`}
                    value={ref.contact}
                    onChange={(e) => {
                      const newRefs = [...formData.references];
                      newRefs[index] = { ...ref, contact: e.target.value };
                      handleInputChange('references', newRefs);
                    }}
                    className={inputClasses}
                  />
                </div>
              ))}
            </div>

            {/* Work Samples */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Work Samples</h3>
              <Input
                label="Links to Work Samples (comma-separated)"
                value={formData.workSamples}
                onChange={(e) => handleInputChange('workSamples', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};