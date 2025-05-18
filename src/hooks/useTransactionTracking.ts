import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { useProfile } from './useProfile';

export interface Transaction {
  id: string;
  type: 'donation' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export function useTransactionTracking() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { profile } = useProfile();

  const trackTransaction = async (
    type: Transaction['type'],
    amount: number,
    txHash?: string,
    metadata?: Record<string, any>
  ) => {
    if (!profile?.id) throw new Error('Profile not found');

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          type,
          amount,
          status: 'pending',
          tx_hash: txHash,
          metadata
        });

      if (error) throw error;

      showToast('success', 'Transaction tracked successfully');
      await fetchTransactions();
    } catch (error) {
      showToast('error', 'Failed to track transaction');
      throw error;
    }
  };

  const fetchTransactions = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data);
    } catch (error) {
      showToast('error', 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [profile?.id]);

  return {
    transactions,
    trackTransaction,
    loading
  };
}