import { ApiPromise, WsProvider } from '@polkadot/api';
import { useEffect, useState, useCallback } from 'react';
import { NETWORK_ENDPOINTS, DEFAULT_NETWORK } from '@/config/contracts';
import { Logger } from '@/utils/logger';

// Use a singleton pattern for the API instance
let api: ApiPromise | null = null;
const RECONNECT_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 3;

export function useSubstrateApi() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const connect = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);
      
      // Disconnect existing API instance if it exists
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
        setIsConnected(false);
      });

      provider.on('disconnected', () => {
        Logger.warn('Disconnected from network', { endpoint });
        setIsConnected(false);

        // Attempt reconnection if within retry limit
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => connect(), RECONNECT_TIMEOUT * Math.pow(2, retryCount));
        } else {
          setError(new Error('Failed to maintain connection after multiple attempts'));
        }
      });

      provider.on('connected', () => {
        setRetryCount(0); // Reset retry count on successful connection
        setIsConnected(true);
        setError(null);
        Logger.info('Connected to network', { endpoint });
      });

      // Create API instance
      api = await ApiPromise.create({ 
        provider,
        throwOnConnect: true,
        noInitWarn: true
      });

      // Wait for API to be ready
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
        setTimeout(() => connect(), RECONNECT_TIMEOUT * Math.pow(2, retryCount));
      }
    } finally {
      setIsInitializing(false);
    }
  }, [retryCount]);

  return { 
    api, 
    isConnected, 
    error,
    isInitializing,
    connect
  };
}