import { ApiPromise, WsProvider } from '@polkadot/api';
import { useEffect, useState, useCallback } from 'react';
import { NETWORK_ENDPOINTS, DEFAULT_NETWORK } from '@/config/contracts';
import { Logger } from '@/utils/logger';

let api: ApiPromise | null = null;
const RECONNECT_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 3;

export function useSubstrateApi() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false); // Changed to false to prevent auto-initialization
  const [retryCount, setRetryCount] = useState(0);

  const connect = useCallback(async () => {
    try {
      setIsInitializing(true);
      
      if (api) {
        await api.disconnect();
        api = null;
      }

      const endpoint = NETWORK_ENDPOINTS[DEFAULT_NETWORK];
      const provider = new WsProvider(endpoint, false); // false = don't connect immediately
      
      // Add connection event handlers
      provider.on('error', (error) => {
        Logger.error('WebSocket error:', { error, endpoint });
        setError(new Error('Failed to connect to network'));
      });

      provider.on('disconnected', () => {
        Logger.warn('Disconnected from network', { endpoint });
        setIsConnected(false);

        // Attempt reconnection if within retry limit
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => connect(), RECONNECT_TIMEOUT);
        } else {
          setError(new Error('Failed to maintain connection after multiple attempts'));
        }
      });

      provider.on('connected', () => {
        setRetryCount(0); // Reset retry count on successful connection
        setIsConnected(true);
        setError(null);
      });

      api = await ApiPromise.create({ 
        provider,
        throwOnConnect: true,
        noInitWarn: true
      });

      await api.isReady;
      
      Logger.info('Connected to network', { 
        endpoint,
        chain: await api.runtimeChain.toString(),
        retryCount
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to network';
      Logger.error('API connection error:', { error: err, retryCount });
      setError(new Error(message));
      setIsConnected(false);

      // Attempt reconnection if within retry limit
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => connect(), RECONNECT_TIMEOUT);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [retryCount]);

  // Removed the auto-connect useEffect

  return { 
    api, 
    isConnected, 
    error,
    isInitializing,
    connect // Expose connect function but don't call it automatically
  };
}