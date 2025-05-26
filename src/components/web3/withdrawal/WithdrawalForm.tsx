import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDonation } from '@/hooks/web3/useDonation';
import { validateAmount } from '@/utils/validation';
import { Logger } from '@/utils/logger';

interface WithdrawalFormProps {
  onSuccess?: () => void;
}

export function WithdrawalForm({ onSuccess }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const { withdraw, loading, error: withdrawalError } = useDonation();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateAmount(parseFloat(amount))) {
      setError('Please enter a valid amount between 0 and 1,000,000');
      return;
    }

    try {
      await withdraw(amount);
      setAmount('');
      setTokenAddress('');
      onSuccess?.();

      Logger.info('Withdrawal submitted', {
        amount,
        token: 'GLMR'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || withdrawalError) && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md">
          {error || withdrawalError}
        </div>
      )}

      <Input
        label="Amount (GLMR)"
        type="number"
        min="0"
        step="0.000000000000000001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Button
        type="submit"
        disabled={loading || !amount}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Withdraw'}
      </Button>
    </form>
  );
}