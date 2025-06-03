import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { useProfile } from './useProfile';

interface DonationMetrics {
  totalDonated: number;
  donationCount: number;
  averageDonation: number;
  impactMetrics: Record<string, number>;
}

interface TimeseriesData {
  date: string;
  amount: number;
}

export function useDonationAnalytics() {
  const [metrics, setMetrics] = useState<DonationMetrics | null>(null);
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { profile } = useProfile();

  const fetchAnalytics = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      // Fetch aggregate metrics
      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_donation_metrics', { user_id: profile.id });

      if (metricsError) throw metricsError;

      // Fetch timeseries data
      const { data: timeseriesData, error: timeseriesError } = await supabase
        .rpc('get_donation_timeseries', { user_id: profile.id });

      if (timeseriesError) throw timeseriesError;

      setMetrics(metricsData);
      setTimeseriesData(timeseriesData);
    } catch (error) {
      showToast('error', 'Failed to fetch analytics');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [profile?.id]);

  return {
    metrics,
    timeseriesData,
    loading,
    refreshAnalytics: fetchAnalytics
  };
}