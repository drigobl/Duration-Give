import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateAmount } from '@/utils/validation';
import { useToast } from '@/contexts/ToastContext';
import { Logger } from '@/utils/logger';
import { ethers } from 'ethers';
import { getContractAddress } from '@/config/contracts';
import CharityScheduledDistributionABI from '@/contracts/CharityScheduledDistribution.sol/CharityScheduledDistribution.json';

interface ScheduledDonationFormProps {
  charityAddress: string;
  charityName: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ScheduledDonationForm({ 
  charityAddress, 
  charityName, 
  onSuccess, 
  onClose 
}: ScheduledDonationFormProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { provider, address, isConnected, connect } = useWeb3();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateAmount(parseFloat(amount))) {
      setError('Please enter a valid amount between 0 and 1,000,000');
      return;
    }

    if (!isConnected || !provider || !address) {
      try {
        await connect();
      } catch (err) {
        setError('Please connect your wallet to continue');
        return;
      }
    }

    try {
      setLoading(true);

      // Get the distribution contract address
      const distributionAddress = getContractAddress('DISTRIBUTION');
      
      // Create contract instance
      const signer = await provider.getSigner();
      const distributionContract = new ethers.Contract(
        distributionAddress,
        CharityScheduledDistributionABI.abi,
        signer
      );

      // For now, we'll use the native token (GLMR)
      // In a real implementation, you would get the token address from a dropdown
      const tokenAddress = getContractAddress('TOKEN');

      // First, approve the token transfer
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        signer
      );

      const parsedAmount = ethers.parseEther(amount);
      const approveTx = await tokenContract.approve(distributionAddress, parsedAmount);
      await approveTx.wait();

      // Create the scheduled donation
      const tx = await distributionContract.createSchedule(
        charityAddress,
        tokenAddress,
        parsedAmount
      );

      await tx.wait();

      showToast('success', 'Monthly donation scheduled', 
        `Your donation of ${amount} tokens will be distributed monthly to ${charityName}`);
      
      Logger.info('Scheduled donation created', {
        charity: charityAddress,
        amount,
        token: tokenAddress
      });

      setAmount('');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule donation';
      setError(message);
      Logger.error('Scheduled donation failed', { error: err });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-gray-600">Connect your wallet to schedule monthly donations</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Schedule a monthly donation to {charityName}. The total amount will be divided into 12 equal monthly payments.
        </p>
      </div>

      <Input
        label="Total Amount (for 12 months)"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        helperText="This amount will be divided into 12 equal monthly payments"
      />

      <div className="bg-blue-50 p-3 rounded-md mb-2">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Monthly payment:</span> {amount ? (parseFloat(amount) / 12).toFixed(2) : '0.00'} tokens
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading || !amount}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Schedule Monthly Donation'}
      </Button>
    </form>
  );
}