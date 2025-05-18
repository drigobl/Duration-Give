import { useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Logger } from '@/utils/logger';

export function useSubstrateAccount() {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect to Polkadot extension and get accounts
  const connectAccounts = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Enable the extension
      const extensions = await web3Enable('Give Protocol');
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found. Please install the Polkadot.js extension.');
      }

      // Get accounts
      const allAccounts = await web3Accounts();
      if (allAccounts.length === 0) {
        throw new Error('No accounts found in your Polkadot wallet. Please create an account first.');
      }
      
      setAccounts(allAccounts);
      
      // Select the first account by default
      if (allAccounts.length > 0 && !selectedAccount) {
        setSelectedAccount(allAccounts[0]);
      }
      
      Logger.info('Connected to Polkadot extension', {
        accountsCount: allAccounts.length
      });
      
      return allAccounts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Polkadot extension';
      Logger.error('Polkadot connection error', { error: err });
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    accounts,
    selectedAccount,
    setSelectedAccount,
    error,
    connectAccounts,
    isConnecting
  };
}