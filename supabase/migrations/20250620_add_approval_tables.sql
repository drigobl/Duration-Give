/*
  # Add Approval Tables for Admin Management
  
  1. New Tables
    - charity_approvals: Track charity registration approval requests
    - profile_update_approvals: Track charity profile update requests
  
  2. Security
    - Enable RLS on both tables
    - Add policies for admin access and charity visibility
*/

BEGIN;

-- Create charity approvals table
CREATE TABLE IF NOT EXISTS charity_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id uuid REFERENCES profiles(id) NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('new_registration', 'reactivation')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Registration details
  charity_name text NOT NULL,
  description text,
  category text NOT NULL,
  registration_number text,
  tax_id text,
  
  -- Documents
  registration_document_url text,
  tax_certificate_url text,
  
  -- Admin handling
  reviewed_by uuid REFERENCES profiles(id),
  review_notes text,
  reviewed_at timestamptz,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create profile update approvals table
CREATE TABLE IF NOT EXISTS profile_update_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Current values (for reference)
  current_name text,
  current_description text,
  current_category text,
  current_image_url text,
  
  -- Requested updates
  new_name text,
  new_description text,
  new_category text,
  new_image_url text,
  
  -- Supporting documentation
  supporting_documents jsonb DEFAULT '[]',
  update_reason text,
  
  -- Admin handling
  reviewed_by uuid REFERENCES profiles(id),
  review_notes text,
  reviewed_at timestamptz,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE charity_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_update_approvals ENABLE ROW LEVEL SECURITY;

-- Policies for charity_approvals
CREATE POLICY "Admins can view all charity approvals" ON charity_approvals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

CREATE POLICY "Admins can update charity approvals" ON charity_approvals
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

CREATE POLICY "Charities can view their own approvals" ON charity_approvals
  FOR SELECT
  USING (charity_id = auth.uid());

CREATE POLICY "Charities can create approval requests" ON charity_approvals
  FOR INSERT
  WITH CHECK (charity_id = auth.uid());

-- Policies for profile_update_approvals
CREATE POLICY "Admins can view all profile update approvals" ON profile_update_approvals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

CREATE POLICY "Admins can update profile update approvals" ON profile_update_approvals
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.type = 'admin'
    )
  );

CREATE POLICY "Charities can view their own profile update approvals" ON profile_update_approvals
  FOR SELECT
  USING (charity_id = auth.uid());

CREATE POLICY "Charities can create profile update requests" ON profile_update_approvals
  FOR INSERT
  WITH CHECK (charity_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at
CREATE TRIGGER update_charity_approvals_updated_at
  BEFORE UPDATE ON charity_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_update_approvals_updated_at
  BEFORE UPDATE ON profile_update_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_charity_approvals_charity_id ON charity_approvals(charity_id);
CREATE INDEX idx_charity_approvals_status ON charity_approvals(status);
CREATE INDEX idx_profile_update_approvals_charity_id ON profile_update_approvals(charity_id);
CREATE INDEX idx_profile_update_approvals_status ON profile_update_approvals(status);

COMMIT;