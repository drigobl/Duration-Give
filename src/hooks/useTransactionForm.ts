import { useState } from 'react';
import { validateAmount } from '@/utils/validation';
import { Logger } from '@/utils/logger';
import { useSubstrateTransaction } from '@/hooks/substrate/useSubstrateTransaction';

interface TransactionFormConfig {
  onSuccess?: () => void;
  // Web3/Substrate specific config
  pallet?: string;
  method?: string;
}

export function useTransactionForm({ onSuccess, pallet, method }: TransactionFormConfig = {}) {
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use substrate transaction hook if pallet and method are provided
  const substrateTransaction = pallet && method 
    ? useSubstrateTransaction({ pallet, method })
    : null;

  const handleSubmit = async (
    e: React.FormEvent, 
    submitFnOrArgs?: ((amount: string) => Promise<void>) | unknown[]
  ) => {
    e.preventDefault();
    setValidationError('');

    const numAmount = parseFloat(amount);
    if (!validateAmount(numAmount)) {
      setValidationError('Please enter a valid amount between 0 and 1,000,000');
      return;
    }

    try {
      // If using substrate transaction
      if (substrateTransaction && Array.isArray(submitFnOrArgs)) {
        await substrateTransaction.execute(...submitFnOrArgs, amount);
      } 
      // If using custom submit function
      else if (typeof submitFnOrArgs === 'function') {
        setLoading(true);
        await submitFnOrArgs(amount);
      } else {
        throw new Error('Invalid submit configuration');
      }

      setAmount('');
      onSuccess?.();

      Logger.info('Transaction successful', {
        amount,
        ...(pallet && method && { pallet, method })
      });
    } catch (err) {
      Logger.error('Transaction failed', {
        error: err instanceof Error ? err.message : String(err),
        amount,
        ...(pallet && method && { pallet, method })
      });
      throw err;
    } finally {
      if (!substrateTransaction) {
        setLoading(false);
      }
    }
  };

  return {
    amount,
    setAmount,
    validationError,
    loading: substrateTransaction?.loading ?? loading,
    handleSubmit
  };
}