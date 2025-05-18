import { useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export function useSubstrateAccount() {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Modified to remove auto-connection
  const connectAccounts = async () => {
    try {
      const extensions = await web3Enable('Give Protocol');
      if (extensions.length === 0) {
        throw new Error('No extension found');
      }

      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);
      
      if (allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get accounts'));
    }
  };

  return {
    accounts,
    selectedAccount,
    setSelectedAccount,
    error,
    connectAccounts // Expose the connect function but don't call it automatically
  };
}