import { useState, useEffect } from 'react';
import { getCharity, getCharityCauses } from '@/lib/api/queries';
import { CharityData, CauseData } from '@/lib/api/types';
import { Logger } from '@/utils/logger';

export function useCharity(id: string) {
  const [charity, setCharity] = useState<CharityData | null>(null);
  const [causes, setCauses] = useState<CauseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch charity data
        const charityResponse = await getCharity(id);
        if (charityResponse.error) throw new Error(charityResponse.error.message);
        
        // Fetch causes
        const causesResponse = await getCharityCauses(id);
        if (causesResponse.error) throw new Error(causesResponse.error.message);

        if (mounted) {
          setCharity(charityResponse.data);
          setCauses(causesResponse.data || []);
        }
      } catch (err) {
        Logger.error('Failed to fetch charity data', { error: err, charityId: id });
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch charity data'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await getCharity(id);
      if (response.error) throw new Error(response.error.message);
      setCharity(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh charity data'));
    } finally {
      setLoading(false);
    }
  };

  return {
    charity,
    causes,
    loading,
    error,
    refresh,
  };
}