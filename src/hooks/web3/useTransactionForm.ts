import { useState } from 'react';
import { useSubstrateTransaction } from '@/hooks/substrate/useSubstrateTransaction';
import { validateAmount } from '@/utils/validation';
import { Logger } from '@/utils/logger';

interface TransactionFormConfig {
  pallet: string;
  method: string;
  onSuccess?: () => void;
}

export function useTransactionForm({ pallet, method, onSuccess }: TransactionFormConfig) {
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');
  const { execute, loading } = useSubstrateTransaction({ pallet, method });

  const handleSubmit = async (e: React.FormEvent, args: unknown[] = []) => {
    e.preventDefault();
    setValidationError('');

    const numAmount = parseFloat(amount);
    if (!validateAmount(numAmount)) {
      setValidationError('Please enter a valid amount between 0 and 1,000,000');
      return;
    }

    try {
      await execute(...args, amount);
      setAmount('');
      onSuccess?.();

      Logger.info('Transaction successful', {
        pallet,
        method,
        amount
      });
    } catch (err) {
      Logger.error('Transaction failed', {
        error: err,
        pallet,
        method,
        amount
      });
      throw err;
    }
  };

  return {
    amount,
    setAmount,
    validationError,
    loading,
    handleSubmit
  };
}