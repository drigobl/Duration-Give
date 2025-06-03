import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from './ui/Button';
import { CHAIN_IDS } from '@/config/contracts';

export const ConnectionTest: React.FC = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [supabaseError, setSupabaseError] = useState<string>('');
  const { connect, isConnected, chainId, error: web3Error } = useWeb3();

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('profiles').select('count');
      if (error) throw error;
      setSupabaseStatus('success');
    } catch (err) {
      setSupabaseStatus('error');
      setSupabaseError(err instanceof Error ? err.message : 'Failed to connect to Supabase');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Connection Test</h2>
      
      <div className="space-y-6">
        {/* Supabase Connection Status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Supabase Connection</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              supabaseStatus === 'checking' ? 'bg-yellow-500' :
              supabaseStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{
              supabaseStatus === 'checking' ? 'Checking connection...' :
              supabaseStatus === 'success' ? 'Connected to Supabase' : 'Connection failed'
            }</span>
          </div>
          {supabaseError && (
            <p className="mt-2 text-sm text-red-600">{supabaseError}</p>
          )}
        </div>

        {/* Web3 Connection Status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Web3 Connection</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isConnected ? 'Wallet connected' : 'Wallet not connected'}</span>
            </div>
            {chainId && (
              <p className="text-sm text-gray-600">
                Connected to chain ID: {chainId === CHAIN_IDS.MOONBASE ? 'Moonbase Alpha (1287)' : chainId}
              </p>
            )}
            {web3Error && (
              <p className="text-sm text-red-600">{web3Error.message}</p>
            )}
            {!isConnected && (
              <Button
                onClick={connect}
                className="mt-2"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};