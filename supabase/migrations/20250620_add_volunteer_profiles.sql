/*
  # Add Volunteer Profiles Table
  
  1. New Tables
    - volunteer_profiles: Store volunteer profile information
  
  2. Security
    - Enable RLS on volunteer_profiles
    - Add policies for users to manage their own profiles
*/

BEGIN;

-- Create volunteer profiles table
CREATE TABLE IF NOT EXISTS volunteer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  date_of_birth date,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  certifications text[] DEFAULT '{}',
  experience text,
  availability jsonb DEFAULT '{"weekdays": false, "weekends": false, "evenings": false}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for volunteer_profiles
CREATE POLICY "Users can view their own volunteer profile" ON volunteer_profiles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own volunteer profile" ON volunteer_profiles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own volunteer profile" ON volunteer_profiles
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all volunteer profiles" ON volunteer_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

CREATE POLICY "Charities can view volunteer profiles of applicants" ON volunteer_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM volunteer_applications va
      JOIN volunteer_opportunities vo ON va.opportunity_id = vo.id
      WHERE va.applicant_id = volunteer_profiles.user_id
      AND vo.charity_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_volunteer_profiles_updated_at
  BEFORE UPDATE ON volunteer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_volunteer_profiles_user_id ON volunteer_profiles(user_id);

COMMIT;