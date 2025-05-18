import React, { useState } from 'react';
import { Wallet, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useWeb3 } from '@/contexts/Web3Context';

export const WalletPrompt: React.FC = () => {
  const { connect, isConnecting, error } = useWeb3();
  const [showError, setShowError] = useState(false);

  const handleConnect = async () => {
    try {
      setShowError(false);
      await connect();
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <Card className="p-8 max-w-lg mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-indigo-100 rounded-full">
          <Wallet className="h-8 w-8 text-indigo-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Connect Your Wallet
      </h2>
      <p className="text-gray-600 mb-6">
        To start making donations and participating in governance, please connect your wallet to the Moonbeam parachain.
      </p>

      {showError && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-left">
            <p className="text-red-700 font-medium">Connection Failed</p>
            <p className="text-red-600 text-sm mt-1">
              {error?.message || 'Please make sure MetaMask is installed and try again.'}
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full flex items-center justify-center"
      >
        <Wallet className="h-5 w-5 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      <div className="mt-6 space-y-4 text-sm text-gray-500">
        <p>
          Don't have a wallet?{' '}
          <a 
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Install MetaMask
          </a>
        </p>
        <p>
          Need help?{' '}
          <a 
            href="https://docs.moonbeam.network/tokens/connect/metamask/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Learn how to set up MetaMask for Moonbeam
          </a>
        </p>
      </div>
    </Card>
  );
};