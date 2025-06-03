import { useState, useEffect } from 'react';
import { getCharity, getCharityCauses } from '@/lib/api/queries';
import { CharityData, CauseData } from '@/lib/api/types';
import { useWeb3 } from '@/contexts/Web3Context';
import { Logger } from '@/utils/logger';

interface CharityInfo {
  totalReceived: number;
  availableBalance: number;
}

interface UseCharityOptions {
  // For database charity lookup
  charityId?: string;
  // For blockchain charity lookup
  charityAddress?: string;
}

export function useCharity({ charityId, charityAddress }: UseCharityOptions) {
  const { address } = useWeb3();
  const [charity, setCharity] = useState<CharityData | null>(null);
  const [causes, setCauses] = useState<CauseData[]>([]);
  const [charityInfo, setCharityInfo] = useState<CharityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch database charity data if charityId provided
        if (charityId) {
          const charityResponse = await getCharity(charityId);
          if (charityResponse.error) throw new Error(charityResponse.error.message);
          
          const causesResponse = await getCharityCauses(charityId);
          if (causesResponse.error) throw new Error(causesResponse.error.message);

          if (mounted) {
            setCharity(charityResponse.data);
            setCauses(causesResponse.data || []);
          }
        }

        // Fetch blockchain charity info if address provided
        if (charityAddress) {
          // TODO: Replace with actual blockchain query
          // This is simulated data for now
          if (mounted) {
            setCharityInfo({
              totalReceived: 1000,
              availableBalance: 500
            });
          }
        }
      } catch (err) {
        Logger.error('Failed to fetch charity data', { 
          error: err, 
          charityId, 
          charityAddress 
        });
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch charity data'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (charityId || charityAddress) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [charityId, charityAddress, address]);

  const refresh = async () => {
    if (!charityId) return;
    
    setLoading(true);
    try {
      const response = await getCharity(charityId);
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
    charityInfo,
    loading,
    error,
    refresh,
  };
}