import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { Logger } from '@/utils/logger';
import { CHAIN_IDS } from '@/config/contracts';

interface Web3ContextType {
  provider: ethers.Provider | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: Error | null;
  switchChain: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const MOONBASE_CHAIN_INFO = {
  chainId: `0x${CHAIN_IDS.MOONBASE.toString(16)}`,
  chainName: 'Moonbase Alpha',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18
  },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io/']
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAddress(null);
      setProvider(null);
      setChainId(null);
      Logger.info('Wallet disconnected');
    } else {
      setAddress(accounts[0]);
      Logger.info('Account changed', { address: accounts[0] });
    }
  }, []);

  // Handle chain changes
  const handleChainChanged = useCallback(async (chainIdHex: string) => {
    const newChainId = parseInt(chainIdHex, 16);
    Logger.info('Chain changed', { chainId: newChainId });
    
    try {
      // Update chain ID state
      setChainId(newChainId);
      
      // If we have a provider, update it to reflect the new chain
      if (provider && window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const network = await newProvider.getNetwork();
        
        // Verify the network matches what we expect
        if (Number(network.chainId) === newChainId) {
          setProvider(newProvider);
          Logger.info('Provider updated for new chain', { chainId: newChainId });
        } else {
          Logger.warn('Network mismatch after chain change', { 
            expected: newChainId, 
            actual: Number(network.chainId) 
          });
        }
      }
    } catch (error) {
      Logger.error('Failed to update provider after chain change', { error });
      // Clear provider if we can't update it properly
      setProvider(null);
      setError(new Error('Failed to update connection after network change. Please reconnect your wallet.'));
    }
  }, [provider]);

  // Initialize provider and check for existing connection
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            
            setProvider(provider);
            setAddress(accounts[0]);
            setChainId(Number(network.chainId));
            Logger.info('Restored existing connection', { 
              address: accounts[0],
              chainId: network.chainId 
            });
          }
        } catch (err) {
          Logger.error('Failed to restore connection', { error: err });
        }
      }
    };

    initProvider();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', () => {
        setProvider(null);
        setAddress(null);
        setChainId(null);
      });

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', () => {});
        }
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      const error = new Error('Please install MetaMask to connect');
      Logger.error('MetaMask not found', { error });
      setError(error);
      throw error;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create Web3 provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get connected chain ID
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);

      // Set provider first so it's available for chain switching
      setProvider(provider);
      
      // Switch to Moonbase Alpha if on wrong network
      if (currentChainId !== CHAIN_IDS.MOONBASE) {
        try {
          await switchChain(CHAIN_IDS.MOONBASE);
        } catch (switchError: any) {
          // If user rejected the switch, throw error
          if (switchError?.code === 4001) {
            throw new Error('Please switch to Moonbase Alpha (TestNet)');
          }
          // For other errors, log warning but continue
          Logger.warn('Failed to switch to Moonbase Alpha', { error: switchError });
        }
      }

      // Get chain ID again in case it changed
      const finalNetwork = await provider.getNetwork();
      setChainId(Number(finalNetwork.chainId));
      
      // Set connected account
      setAddress(accounts[0]);

      Logger.info('Wallet connected successfully', {
        address: accounts[0],
        chainId: Number(finalNetwork.chainId)
      });

    } catch (err: any) {
      // Handle user rejected request
      if (err?.code === 4001) {
        const error = new Error('User rejected wallet connection');
        setError(error);
        throw error;
      }

      // Handle other errors
      const message = err?.message || 'Failed to connect wallet';
      const error = new Error(message);
      Logger.error('Wallet connection failed', { error });
      setError(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      // Clear state
      setProvider(null);
      setAddress(null);
      setChainId(null);
      setError(null);
      
      // If provider has a disconnect method, call it
      if (window.ethereum && typeof window.ethereum.disconnect === 'function') {
        await window.ethereum.disconnect();
      }
      
      Logger.info('Wallet disconnected');
      return true;
    } catch (err) {
      Logger.error('Error disconnecting wallet', { error: err });
      return false;
    }
  }, []);

  const switchChain = useCallback(async (targetChainId: number) => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to switch networks');
    }

    try {
      setError(null); // Clear any previous errors
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
      
      // The handleChainChanged callback will update our state
      Logger.info('Network switch requested', { chainId: targetChainId });
      
    } catch (error: any) {
      // Handle user rejection
      if (error.code === 4001) {
        throw new Error('Network switch cancelled by user');
      }
      
      // If the chain hasn't been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MOONBASE_CHAIN_INFO]
          });
          Logger.info('Added and switched to Moonbase Alpha network');
        } catch (addError: any) {
          Logger.error('Failed to add network', { error: addError });
          
          if (addError.code === 4001) {
            throw new Error('Network addition cancelled by user');
          }
          throw new Error('Failed to add Moonbase Alpha network');
        }
      } else {
        Logger.error('Failed to switch network', { error });
        throw new Error(`Failed to switch network: ${error.message || 'Unknown error'}`);
      }
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        address,
        chainId,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        error,
        switchChain
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}