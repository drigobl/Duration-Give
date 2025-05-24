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
import { formatDate } from '@/utils/date';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { provider, address, isConnected, connect } = useWeb3();
  const { showToast } = useToast();

  // Calculate start and end dates for the donation schedule
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 12);

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
        setTransactionHash(receipt.hash);
        setShowConfirmation(true);

        Logger.info('Scheduled donation created', {
          charity: charityAddress,
          amount,
          token: tokenAddress,
          txHash: receipt.hash
        });
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
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setAmount('');
    setShowConfirmation(false);
    setTransactionHash(null);
    onSuccess?.();
  };

  if (showConfirmation) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Monthly donation scheduled successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your donation of {amount} tokens has been scheduled.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Schedule Details:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><span className="font-medium">Total Amount:</span> {amount} tokens</li>
            <li><span className="font-medium">Monthly Payment:</span> {(parseFloat(amount) / 12).toFixed(2)} tokens</li>
            <li><span className="font-medium">Start Date:</span> {formatDate(startDate.toISOString())}</li>
            <li><span className="font-medium">End Date:</span> {formatDate(endDate.toISOString())}</li>
            <li><span className="font-medium">Recipient:</span> {charityName}</li>
          </ul>
        </div>

        {transactionHash && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
            <a 
              href={`https://moonbase.moonscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-indigo-600 hover:text-indigo-800 break-all"
            >
              {transactionHash}
            </a>
          </div>
        )}

        <Button
          onClick={handleConfirmationClose}
          className="w-full"
        >
          Close
        </Button>
      </div>
    );
  }

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
        <p className="text-sm text-blue-700 mt-1">
          <span className="font-medium">Schedule period:</span> {formatDate(startDate.toISOString())} to {formatDate(endDate.toISOString())}
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