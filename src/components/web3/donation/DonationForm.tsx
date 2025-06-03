import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateAmount } from '@/utils/validation';
import { useDonation, DonationType } from '@/hooks/web3/useDonation';
import { Logger } from '@/utils/logger';

interface DonationFormProps {
  charityAddress: string;
  onSuccess?: () => void;
}

export function DonationForm({ charityAddress, onSuccess }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState<DonationType>(DonationType.NATIVE);
  const [tokenAddress, setTokenAddress] = useState('');
  const { donate, loading, error: donationError } = useDonation();
  const { isConnected, connect } = useWeb3();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateAmount(parseFloat(amount))) {
      setError('Please enter a valid amount between 0 and 1,000,000');
      return;
    }

    try {
      await donate({
        charityAddress,
        amount,
        type: donationType,
        tokenAddress: donationType === DonationType.TOKEN ? tokenAddress : undefined
      });

      setAmount('');
      onSuccess?.();

      Logger.info('Donation submitted', {
        charity: charityAddress,
        amount,
        type: donationType,
        token: tokenAddress || 'GLMR'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process donation');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-gray-600">Connect your wallet to donate</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || donationError) && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md">
          {error || donationError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Type
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              name="donationType"
              value={DonationType.NATIVE}
              checked={donationType === DonationType.NATIVE}
              onChange={(e) => setDonationType(e.target.value as DonationType)}
            />
            <span className="ml-2">GLMR</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-indigo-600"
              name="donationType"
              value={DonationType.TOKEN}
              checked={donationType === DonationType.TOKEN}
              onChange={(e) => setDonationType(e.target.value as DonationType)}
            />
            <span className="ml-2">ERC20 Token</span>
          </label>
        </div>
      </div>

      {donationType === DonationType.TOKEN && (
        <Input
          label="Token Address"
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter ERC20 token address"
          required
        />
      )}

      <Input
        label={`Amount (${donationType === DonationType.NATIVE ? 'GLMR' : 'Tokens'})`}
        type="number"
        min="0"
        step="0.000000000000000001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Button
        type="submit"
        disabled={loading || !amount || (donationType === DonationType.TOKEN && !tokenAddress)}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Donate'}
      </Button>
    </form>
  );
}