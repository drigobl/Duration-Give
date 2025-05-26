import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { useProfile } from './useProfile';

interface CharityVerification {
  id: string;
  charity_id: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: Array<{
    type: string;
    url: string;
  }>;
}

export function useAdminPanel() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { profile } = useProfile();

  const fetchPendingVerifications = async () => {
    if (!profile?.id) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('charity_verifications')
        .select(`
          id,
          charity_id,
          status,
          charity_documents (
            document_type,
            document_url
          )
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    } catch (error) {
      showToast('error', 'Failed to fetch verifications');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (
    verificationId: string,
    status: 'approved' | 'rejected',
    reason?: string
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('charity_verifications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          review_notes: reason
        })
        .eq('id', verificationId);

      if (error) throw error;
      showToast('success', `Verification ${status} successfully`);
    } catch (error) {
      showToast('error', 'Failed to update verification status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPendingVerifications,
    updateVerificationStatus,
    loading
  };
}