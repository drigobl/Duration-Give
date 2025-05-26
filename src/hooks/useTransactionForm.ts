import { useState } from 'react';
import { validateAmount } from '@/utils/validation';
import { Logger } from '@/utils/logger';

interface TransactionFormConfig {
  onSuccess?: () => void;
}

export function useTransactionForm({ onSuccess }: TransactionFormConfig) {
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, submitFn: (amount: string) => Promise<void>) => {
    e.preventDefault();
    setValidationError('');

    const numAmount = parseFloat(amount);
    if (!validateAmount(numAmount)) {
      setValidationError('Please enter a valid amount between 0 and 1,000,000');
      return;
    }

    try {
      setLoading(true);
      await submitFn(amount);
      setAmount('');
      onSuccess?.();

      Logger.info('Transaction successful', {
        amount
      });
    } catch (err) {
      Logger.error('Transaction failed', {
        error: err instanceof Error ? err.message : String(err),
        amount
      });
      throw err;
    } finally {
      setLoading(false);
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