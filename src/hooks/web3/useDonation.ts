import { useState } from 'react';
import { useContract } from './useContract';
import { useWeb3 } from '@/contexts/Web3Context';
import { parseEther } from 'ethers';
import { Logger } from '@/utils/logger';

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

    try {
      setLoading(true);
      setError(null);

      const parsedAmount = parseEther(amount);

      if (type === DonationType.NATIVE) {
        // For direct donations
        if (poolType === PoolType.DIRECT) {
          const tx = await contract.donate(charityAddress, {
            value: parsedAmount
          });
          await tx.wait();
        } 
        // For equity pool donations
        else if (poolType === PoolType.EQUITY) {
          // This would call a different contract method for equity pool donations
          // For now, we'll use the same method
          const tx = await contract.donate(charityAddress, {
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
      const tx = await contract.withdraw(parsedAmount);
      await tx.wait();

      Logger.info('Withdrawal successful', {
        amount
      });
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