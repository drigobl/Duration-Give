import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useContract } from '@/hooks/web3/useContract';
import { useDonation } from '@/hooks/web3/useDonation';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CHAIN_IDS } from '@/config/contracts';
import { formatBalance } from '@/utils/web3';

export const TestConnection: React.FC = () => {
  const { isConnected, address, chainId, connect, switchChain } = useWeb3();
  const { contract: donationContract, error: contractError } = useContract('donation');
  const { donate } = useDonation();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address, chainId]);

  const fetchBalances = async () => {
    try {
      // Fetch native balance
      const nativeBalance = await window.ethereum?.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      setBalance(formatBalance(nativeBalance || '0'));
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchChain(CHAIN_IDS.MOONBASE);
    } catch (error) {
      console.error('Network switch failed:', error);
    }
  };

  const handleTestDonation = async () => {
    try {
      await donate({
        charityAddress: '0x1234567890123456789012345678901234567890', // Test charity address
        amount: '0.1',
        type: 'native'
      });
    } catch (error) {
      console.error('Donation failed:', error);
    }
  };

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Connection Status:</span>
          <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Network Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Network:</span>
          <span className="font-medium">
            {chainId === CHAIN_IDS.MOONBASE ? 'Moonbase Alpha' : chainId || 'Unknown'}
          </span>
        </div>

        {/* Address */}
        {address && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-medium">{address}</span>
          </div>
        )}

        {/* Balances */}
        {isConnected && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">GLMR Balance:</span>
            <span className="font-medium">{balance} GLMR</span>
          </div>
        )}

        {/* Contract Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Contract Status:</span>
          <span className={`font-medium ${contractError ? 'text-red-600' : 'text-green-600'}`}>
            {contractError ? 'Error' : donationContract ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {!isConnected && (
            <Button onClick={handleConnect} className="w-full">
              Connect Wallet
            </Button>
          )}

          {isConnected && chainId !== CHAIN_IDS.MOONBASE && (
            <Button onClick={handleSwitchNetwork} className="w-full">
              Switch to Moonbase Alpha
            </Button>
          )}

          {isConnected && chainId === CHAIN_IDS.MOONBASE && (
            <Button onClick={handleTestDonation} className="w-full">
              Test Donation (0.1 GLMR)
            </Button>
          )}
        </div>

        {/* Error Display */}
        {contractError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md">
            {contractError.message}
          </div>
        )}
      </div>
    </Card>
  );
};