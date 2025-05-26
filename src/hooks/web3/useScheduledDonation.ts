import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';
import { getContractAddress } from '@/config/contracts';
import { Logger } from '@/utils/logger';
import CharityScheduledDistributionABI from '@/contracts/CharityScheduledDistribution.sol/CharityScheduledDistribution.json';

interface ScheduleParams {
  charityAddress: string;
  tokenAddress: string;
  totalAmount: string;
}

interface DonorSchedule {
  id: number;
  charity: string;
  token: string;
  totalAmount: string;
  amountPerMonth: string;
  monthsRemaining: number;
  nextDistribution: Date;
  active: boolean;
}

export function useScheduledDonation() {
  const { provider, address } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async ({ charityAddress, tokenAddress, totalAmount }: ScheduleParams) => {
    if (!provider || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Get the distribution contract address
      const distributionAddress = getContractAddress('DISTRIBUTION');
      
      // Create contract instance
      const signer = await provider.getSigner();
      const distributionContract = new ethers.Contract(
        distributionAddress,
        CharityScheduledDistributionABI.abi,
        signer
      );

      // First, approve the token transfer
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        signer
      );

      const parsedAmount = ethers.parseEther(totalAmount);
      
      try {
        const approveTx = await tokenContract.approve(distributionAddress, parsedAmount);
        await approveTx.wait();
      } catch (approveError: any) {
        // Check if user rejected the transaction
        if (approveError.code === 4001 || approveError.message?.includes('user rejected')) {
          throw new Error('Transaction was rejected. Please approve the transaction in your wallet to continue.');
        }
        throw approveError;
      }

      // Create the scheduled donation
      try {
        const tx = await distributionContract.createSchedule(
          charityAddress,
          tokenAddress,
          parsedAmount
        );

        const receipt = await tx.wait();
        
        Logger.info('Scheduled donation created', {
          charity: charityAddress,
          amount: totalAmount,
          token: tokenAddress,
          txHash: receipt.hash
        });

        return receipt.hash;
      } catch (txError: any) {
        // Check if user rejected the transaction
        if (txError.code === 4001 || txError.message?.includes('user rejected')) {
          throw new Error('Transaction was rejected. Please confirm the transaction in your wallet to schedule your donation.');
        }
        throw txError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule donation';
      setError(message);
      Logger.error('Scheduled donation failed', { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSchedule = async (scheduleId: number) => {
    if (!provider || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Get the distribution contract address
      const distributionAddress = getContractAddress('DISTRIBUTION');
      
      // Create contract instance
      const signer = await provider.getSigner();
      const distributionContract = new ethers.Contract(
        distributionAddress,
        CharityScheduledDistributionABI.abi,
        signer
      );

      // Cancel the schedule
      try {
        const tx = await distributionContract.cancelSchedule(scheduleId);
        const receipt = await tx.wait();

        Logger.info('Scheduled donation cancelled', { 
          scheduleId,
          txHash: receipt.hash
        });

        return receipt.hash;
      } catch (txError: any) {
        // Check if user rejected the transaction
        if (txError.code === 4001 || txError.message?.includes('user rejected')) {
          throw new Error('Transaction was rejected. Please confirm the transaction in your wallet to cancel your donation schedule.');
        }
        throw txError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel scheduled donation';
      setError(message);
      Logger.error('Schedule cancellation failed', { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDonorSchedules = async (): Promise<DonorSchedule[]> => {
    if (!provider || !address) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      // Get the distribution contract address
      const distributionAddress = getContractAddress('DISTRIBUTION');
      
      // Create contract instance
      const distributionContract = new ethers.Contract(
        distributionAddress,
        CharityScheduledDistributionABI.abi,
        provider
      );

      // Get schedule IDs for the donor
      const scheduleIds = await distributionContract.getDonorSchedules(address);

      // Get details for each schedule
      const schedules: DonorSchedule[] = await Promise.all(
        scheduleIds.map(async (id: bigint) => {
          const schedule = await distributionContract.donationSchedules(id);
          return {
            id: Number(id),
            charity: schedule.charity,
            token: schedule.token,
            totalAmount: ethers.formatEther(schedule.totalAmount),
            amountPerMonth: ethers.formatEther(schedule.amountPerMonth),
            monthsRemaining: Number(schedule.monthsRemaining),
            nextDistribution: new Date(Number(schedule.nextDistributionTimestamp) * 1000),
            active: schedule.active
          };
        })
      );

      return schedules;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get scheduled donations';
      setError(message);
      Logger.error('Get schedules failed', { error: err });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    createSchedule,
    cancelSchedule,
    getDonorSchedules,
    loading,
    error
  };
}