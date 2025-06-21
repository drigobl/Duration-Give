// import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { CHAIN_IDS } from '@/config/contracts';
import { Logger } from '@/utils/logger';
import type { EthereumProvider } from '@/types/ethereum';

export interface WalletConnectConfig {
  projectId?: string; // For WalletConnect v2
  rpc: Record<number, string>;
  chainId: number;
  qrcode: boolean;
  qrcodeModalOptions?: {
    mobileLinks?: string[];
  };
}

export class WalletConnectManager {
  private provider: EthereumProvider | null = null;
  private ethersProvider: ethers.Provider | null = null;

  constructor(private config: WalletConnectConfig) {}

  async connect(): Promise<{ provider: ethers.Provider; address: string }> {
    try {
      // Create WalletConnect provider
      // Note: WalletConnect v2 implementation would go here
      // For now, throw a more descriptive error
      throw new Error('WalletConnect integration is currently being updated. Please use MetaMask or another browser wallet.');

      // Enable the provider (triggers QR code modal)
      await this.provider.enable();

      // Create ethers provider
      this.ethersProvider = new ethers.BrowserProvider(this.provider as any);

      // Get accounts
      const accounts = await this.provider.request({ method: 'eth_accounts' }) as string[];
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      Logger.info('WalletConnect connected successfully', {
        address: accounts[0],
        chainId: this.config.chainId
      });

      return {
        provider: this.ethersProvider,
        address: accounts[0]
      };

    } catch (error) {
      Logger.error('WalletConnect connection failed', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.provider) {
        await this.provider.disconnect();
        this.provider = null;
        this.ethersProvider = null;
        Logger.info('WalletConnect disconnected');
      }
    } catch (error) {
      Logger.error('WalletConnect disconnect failed', { error });
    }
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('WalletConnect provider not initialized');
    }

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      Logger.error('WalletConnect chain switch failed', { error, chainId });
      throw error;
    }
  }

  getProvider(): EthereumProvider | null {
    return this.provider;
  }

  getEthersProvider(): ethers.Provider | null {
    return this.ethersProvider;
  }

  isConnected(): boolean {
    return this.provider?.connected || false;
  }

  setupEventListeners(callbacks: {
    onAccountsChanged?: (accounts: string[]) => void;
    onChainChanged?: (chainId: string) => void;
    onDisconnect?: () => void;
  }): void {
    if (!this.provider) return;

    if (callbacks.onAccountsChanged) {
      this.provider.on('accountsChanged', callbacks.onAccountsChanged);
    }

    if (callbacks.onChainChanged) {
      this.provider.on('chainChanged', callbacks.onChainChanged);
    }

    if (callbacks.onDisconnect) {
      this.provider.on('disconnect', callbacks.onDisconnect);
    }
  }
}

// Default WalletConnect configuration
export function getDefaultWalletConnectConfig(): WalletConnectConfig {
  return {
    rpc: {
      [CHAIN_IDS.MOONBASE]: 'https://rpc.api.moonbase.moonbeam.network',
      [CHAIN_IDS.MOONBEAM]: 'https://rpc.api.moonbeam.network',
      [CHAIN_IDS.ASTAR]: 'https://astar.api.onfinality.io/public',
      [CHAIN_IDS.POLYGON]: 'https://polygon-rpc.com',
    },
    chainId: CHAIN_IDS.MOONBASE, // Default to Moonbase Alpha
    qrcode: true,
    qrcodeModalOptions: {
      mobileLinks: [
        'rainbow',
        'metamask',
        'argent',
        'trust',
        'imtoken',
        'pillar',
        'coinbase',
        'nova',
        'subwallet',
        'rabby'
      ]
    }
  };
}