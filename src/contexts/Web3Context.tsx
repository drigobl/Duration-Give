import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { Logger } from '@/utils/logger';
import { CHAIN_IDS } from '@/config/contracts';
import { useWallet } from '@/hooks/useWallet';
import type { EthereumProvider } from '@/types/ethereum';

interface Web3ContextType {
  provider: ethers.Provider | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectedWallet: string | null;
  connect: (walletName?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  error: Error | null;
  switchChain: (chainId: number) => Promise<void>;
  availableWallets: Array<{ name: string; icon: string; installed: boolean }>;
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
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [currentWalletProvider, setCurrentWalletProvider] = useState<EthereumProvider | null>(null);

  const { getInstalledWallets, getWalletByName, getAllWallets } = useWallet();

  // Get available wallets for UI - with error handling
  const availableWallets = React.useMemo(() => {
    try {
      return getAllWallets().map(wallet => ({
        name: wallet.name,
        icon: wallet.icon,
        installed: wallet.isInstalled()
      }));
    } catch (error) {
      Logger.error('Failed to get available wallets', { error });
      return [];
    }
  }, [getAllWallets]);

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAddress(null);
      setProvider(null);
      setChainId(null);
      setConnectedWallet(null);
      setCurrentWalletProvider(null);
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
      if (provider && currentWalletProvider) {
        const newProvider = new ethers.BrowserProvider(currentWalletProvider);
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
  }, [provider, currentWalletProvider]);

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    setProvider(null);
    setAddress(null);
    setChainId(null);
    setConnectedWallet(null);
    setCurrentWalletProvider(null);
    Logger.info('Wallet disconnected via event');
  }, []);

  // Initialize provider and check for existing connection
  useEffect(() => {
    const initProvider = async () => {
      // Check if we have a previously connected wallet stored
      const storedWallet = localStorage.getItem('connectedWallet');
      if (storedWallet) {
        try {
          const wallet = getWalletByName(storedWallet);
          if (wallet && wallet.isInstalled()) {
            const walletProvider = wallet.getProvider?.();
            if (walletProvider) {
              // Check if already connected
              const accounts = await walletProvider.request({ method: 'eth_accounts' }) as string[];
              if (accounts.length > 0) {
                const ethersProvider = new ethers.BrowserProvider(walletProvider);
                const network = await ethersProvider.getNetwork();
                
                setProvider(ethersProvider);
                setAddress(accounts[0]);
                setChainId(Number(network.chainId));
                setConnectedWallet(storedWallet);
                setCurrentWalletProvider(walletProvider);
                
                Logger.info('Restored existing connection', { 
                  wallet: storedWallet,
                  address: accounts[0],
                  chainId: network.chainId 
                });
              }
            }
          }
        } catch (err) {
          Logger.error('Failed to restore connection', { error: err, wallet: storedWallet });
          localStorage.removeItem('connectedWallet'); // Clean up invalid stored wallet
        }
      }
    };

    initProvider();
  }, [getWalletByName]);

  // Set up event listeners for the current wallet provider
  useEffect(() => {
    if (currentWalletProvider) {
      // Set up event listeners for the specific provider
      if (currentWalletProvider.on) {
        currentWalletProvider.on('accountsChanged', handleAccountsChanged);
        currentWalletProvider.on('chainChanged', handleChainChanged);
        currentWalletProvider.on('disconnect', handleDisconnect);
      }

      return () => {
        if (currentWalletProvider.removeListener) {
          currentWalletProvider.removeListener('accountsChanged', handleAccountsChanged);
          currentWalletProvider.removeListener('chainChanged', handleChainChanged);
          currentWalletProvider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [currentWalletProvider, handleAccountsChanged, handleChainChanged, handleDisconnect]);

  const connect = useCallback(async (walletName?: string) => {
    try {
      setIsConnecting(true);
      setError(null);

      // If no wallet name provided, try to use MetaMask as default
      const targetWalletName = walletName || 'MetaMask';
      const wallet = getWalletByName(targetWalletName);

      if (!wallet) {
        throw new Error(`Wallet "${targetWalletName}" not found`);
      }

      if (!wallet.isInstalled()) {
        throw new Error(`${targetWalletName} is not installed. Please install it to continue.`);
      }

      // Connect to the wallet
      const account = await wallet.connect();
      
      // Get the wallet's provider
      const walletProvider = wallet.getProvider?.();
      if (!walletProvider) {
        throw new Error(`Failed to get provider for ${targetWalletName}`);
      }

      // Create Web3 provider
      let ethersProvider: ethers.Provider;
      
      if (targetWalletName === 'WalletConnect') {
        // WalletConnect provides its own ethers provider
        ethersProvider = (wallet as any).walletConnect?.getEthersProvider();
        if (!ethersProvider) {
          throw new Error('Failed to get WalletConnect ethers provider');
        }
      } else {
        // Regular EVM wallet
        ethersProvider = new ethers.BrowserProvider(walletProvider);
      }
      
      // Get connected chain ID
      const network = await ethersProvider.getNetwork();
      const currentChainId = Number(network.chainId);

      // Set provider first so it's available for chain switching
      setProvider(ethersProvider);
      setCurrentWalletProvider(walletProvider);
      
      // Switch to Moonbase Alpha if on wrong network (skip for WalletConnect as it might not support this)
      if (currentChainId !== CHAIN_IDS.MOONBASE && targetWalletName !== 'WalletConnect') {
        try {
          await switchChain(CHAIN_IDS.MOONBASE);
        } catch (switchError: unknown) {
          // If user rejected the switch, throw error
          const error = switchError as { code?: number; message?: string };
          if (error?.code === 4001) {
            throw new Error('Please switch to Moonbase Alpha (TestNet)');
          }
          // For other errors, log warning but continue
          Logger.warn('Failed to switch to Moonbase Alpha', { error: switchError });
        }
      }

      // Get chain ID again in case it changed
      const finalNetwork = await ethersProvider.getNetwork();
      setChainId(Number(finalNetwork.chainId));
      
      // Set connected account and wallet
      setAddress(account);
      setConnectedWallet(targetWalletName);

      // Store the connected wallet for reconnection
      localStorage.setItem('connectedWallet', targetWalletName);

      Logger.info('Wallet connected successfully', {
        wallet: targetWalletName,
        address: account,
        chainId: Number(finalNetwork.chainId)
      });

    } catch (err: unknown) {
      // Handle user rejected request
      const errorObj = err as { code?: number; message?: string };
      if (errorObj?.code === 4001) {
        const error = new Error('User rejected wallet connection');
        setError(error);
        throw error;
      }

      // Handle other errors
      const message = errorObj?.message || 'Failed to connect wallet';
      const error = new Error(message);
      Logger.error('Wallet connection failed', { error, walletName });
      setError(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [getWalletByName]);

  const disconnect = useCallback(async () => {
    try {
      // Disconnect from the current wallet if it supports it
      if (connectedWallet) {
        const wallet = getWalletByName(connectedWallet);
        if (wallet) {
          await wallet.disconnect();
        }
      }

      // Clear state
      setProvider(null);
      setAddress(null);
      setChainId(null);
      setError(null);
      setConnectedWallet(null);
      setCurrentWalletProvider(null);
      
      // Clear stored wallet
      localStorage.removeItem('connectedWallet');
      
      Logger.info('Wallet disconnected');
      return true;
    } catch (err) {
      Logger.error('Error disconnecting wallet', { error: err });
      return false;
    }
  }, [connectedWallet, getWalletByName]);

  const switchChain = useCallback(async (targetChainId: number) => {
    if (!connectedWallet) {
      throw new Error('No wallet connected');
    }

    const wallet = getWalletByName(connectedWallet);
    if (!wallet) {
      throw new Error('Connected wallet not found');
    }

    try {
      setError(null); // Clear any previous errors
      await wallet.switchChain(targetChainId);
      
      // The handleChainChanged callback will update our state
      Logger.info('Network switch requested', { chainId: targetChainId, wallet: connectedWallet });
      
    } catch (error: unknown) {
      Logger.error('Failed to switch network', { error, wallet: connectedWallet });
      throw error;
    }
  }, [connectedWallet, getWalletByName]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        address,
        chainId,
        isConnected: !!address,
        isConnecting,
        connectedWallet,
        connect,
        disconnect,
        error,
        switchChain,
        availableWallets
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