import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { useProfile } from './useProfile';

export type DocumentType = 'tax_certificate' | 'registration' | 'annual_report';

interface VerificationDocument {
  id: string;
  type: DocumentType;
  url: string;
  verified: boolean;
  uploadedAt: Date;
}

export function useCharityVerification() {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const { showToast } = useToast();
  const { profile } = useProfile();

  const uploadDocument = async (file: File, type: DocumentType) => {
    if (!profile?.id) {
      throw new Error('Profile not found');
    }

    try {
      setUploading(true);
      
      // Validate file
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type must be PDF, JPEG, or PNG');
      }

      // Upload to storage
      const fileName = `${profile.id}/${type}/${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('charity-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: insertError } = await supabase
        .from('charity_documents')
        .insert({
          charity_id: profile.id,
          document_type: type,
          document_url: data.path,
          verified: false
        });

      if (insertError) throw insertError;

      showToast('success', 'Document uploaded successfully');
      
      // Refresh documents list
      await fetchDocuments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload document';
      showToast('error', 'Upload failed', message);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('charity_documents')
        .select('*')
        .eq('charity_id', profile.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setDocuments(data.map(doc => ({
        id: doc.id,
        type: doc.document_type,
        url: doc.document_url,
        verified: doc.verified,
        uploadedAt: new Date(doc.uploaded_at)
      })));
    } catch (error) {
      showToast('error', 'Failed to fetch documents');
      throw error;
    }
  };

  return {
    documents,
    uploadDocument,
    uploading,
    fetchDocuments
  };
}