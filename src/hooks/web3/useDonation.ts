import { useState } from 'react';
import { useContract } from './useContract';
import { useWeb3 } from '@/contexts/Web3Context';
import { parseEther } from 'ethers';
import { Logger } from '@/utils/logger';
import { trackTransaction } from '@/lib/sentry';

export enum DonationType {
  NATIVE = 'native',
  TOKEN = 'token'
}

export enum PoolType {
  DIRECT = 'direct',
  EQUITY = 'equity'
}

interface DonationParams {
  charityAddress: string;
  amount: string;
  type: DonationType;
  tokenAddress?: string;
  poolType?: PoolType;
}

export function useDonation() {
  const { contract } = useContract('donation');
  const { address } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const donate = async ({ charityAddress, amount, type, tokenAddress, poolType = PoolType.DIRECT }: DonationParams) => {
    if (!contract || !address) {
      throw new Error('Contract or wallet not connected');
    }

    // Start Sentry transaction tracking
    const transaction = trackTransaction('donation', {
      amount,
      charityId: charityAddress,
      donationType: type,
      status: 'started'
    });

    try {
      setLoading(true);
      setError(null);

      const parsedAmount = parseEther(amount);

      if (type === DonationType.NATIVE) {
        // For direct donations
        if (poolType === PoolType.DIRECT) {
          // In ethers v6, we need to use the contract.getFunction method
          const donateFunction = contract.getFunction('donate');
          const tx = await donateFunction(charityAddress, {
            value: parsedAmount
          });
          await tx.wait();
        } 
        // For equity pool donations
        else if (poolType === PoolType.EQUITY) {
          // This would call a different contract method for equity pool donations
          // For now, we'll use the same method
          const donateFunction = contract.getFunction('donate');
          const tx = await donateFunction(charityAddress, {
            value: parsedAmount
          });
          await tx.wait();
        }

        Logger.info('Donation successful', {
          amount,
          charity: charityAddress,
          type: 'native',
          poolType
        });

        // Mark transaction as successful
        transaction.finish('ok');
      } else {
        // For token donations, we would need to implement this
        // based on the contract's token donation functionality
        throw new Error('Token donations not yet implemented');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process donation';
      setError(message);
      Logger.error('Donation failed', {
        error: err,
        amount,
        charity: charityAddress,
        type
      });
      
      // Mark transaction as failed
      transaction.finish('error');
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: string) => {
    if (!contract || !address) {
      throw new Error('Contract or wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const parsedAmount = parseEther(amount);
      const withdrawFunction = contract.getFunction('withdraw');
      const tx = await withdrawFunction(parsedAmount);
      const receipt = await tx.wait();

      Logger.info('Withdrawal successful', {
        amount,
        txHash: receipt.hash
      });
      
      return receipt.hash;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process withdrawal';
      setError(message);
      Logger.error('Withdrawal failed', {
        error: err,
        amount
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    donate,
    withdraw,
    loading,
    error
  };
}