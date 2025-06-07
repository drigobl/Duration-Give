import { Logger } from '@/utils/logger';
import { CHAIN_IDS } from '@/config/contracts';
import type { EthereumProvider, AddEthereumChainParameter } from '@/types/ethereum';
import { isEthereumError } from '@/types/ethereum';
import { detectInstalledWallets, getWalletProvider, type WalletInfo } from '@/utils/walletDetection';
import { WalletConnectManager, getDefaultWalletConnectConfig } from '@/utils/walletConnect';
import { ethers } from 'ethers';

interface WalletProvider {
  name: string;
  icon: string;
  isInstalled: () => boolean;
  isConnected: (address: string) => Promise<boolean>;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number | string) => Promise<void>;
  getProvider?: () => EthereumProvider | null;
}

class EVMWalletBase implements WalletProvider {
  name: string;
  icon: string;
  protected provider: EthereumProvider | null;

  constructor(name: string, icon: string, provider: EthereumProvider | null) {
    this.name = name;
    this.icon = icon;
    this.provider = provider;
  }

  isInstalled(): boolean {
    return !!this.provider;
  }

  getProvider(): EthereumProvider | null {
    return this.provider;
  }

  async isConnected(address: string): Promise<boolean> {
    try {
      if (!this.provider) return false;
      const accounts = await this.provider.request({ method: 'eth_accounts' }) as string[];
      return accounts?.includes(address) || false;
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error(`${this.name} is not installed. Please install the ${this.name} extension.`);
      }
      
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (!accounts?.length) {
        throw new Error('No accounts found');
      }

      Logger.info(`${this.name} connected successfully`, { address: accounts[0] });
      return accounts[0];
    } catch (error) {
      Logger.error(`${this.name} connection failed`, { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    // Most EVM wallets don't have a disconnect method
    return Promise.resolve();
  }

  async switchChain(chainId: number): Promise<void> {
    try {
      if (!this.provider) {
        throw new Error(`${this.name} provider not found`);
      }
      
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      if (isEthereumError(error) && error.code === 4902) {
        // Chain not added, add it
        await this.addChain(chainId);
      } else {
        throw error;
      }
    }
  }

  protected async addChain(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error(`${this.name} provider not found`);
    }
    
    const chainParams = this.getChainParams(chainId);
    if (!chainParams) throw new Error('Unsupported chain');

    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [chainParams]
    });
  }

  protected getChainParams(chainId: number): AddEthereumChainParameter | undefined {
    const chains = {
      [CHAIN_IDS.MOONBASE]: {
        chainId: `0x${CHAIN_IDS.MOONBASE.toString(16)}`,
        chainName: 'Moonbase Alpha',
        nativeCurrency: {
          name: 'DEV',
          symbol: 'DEV',
          decimals: 18
        },
        rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
        blockExplorerUrls: ['https://moonbase.moonscan.io/']
      },
      [CHAIN_IDS.MOONBEAM]: {
        chainId: `0x${CHAIN_IDS.MOONBEAM.toString(16)}`,
        chainName: 'Moonbeam',
        nativeCurrency: {
          name: 'GLMR',
          symbol: 'GLMR',
          decimals: 18
        },
        rpcUrls: ['https://rpc.api.moonbeam.network'],
        blockExplorerUrls: ['https://moonbeam.moonscan.io/']
      },
      [CHAIN_IDS.ASTAR]: {
        chainId: `0x${CHAIN_IDS.ASTAR.toString(16)}`,
        chainName: 'Astar',
        nativeCurrency: {
          name: 'ASTR',
          symbol: 'ASTR',
          decimals: 18
        },
        rpcUrls: ['https://astar.api.onfinality.io/public'],
        blockExplorerUrls: ['https://blockscout.com/astar']
      },
      [CHAIN_IDS.POLYGON]: {
        chainId: `0x${CHAIN_IDS.POLYGON.toString(16)}`,
        chainName: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com/']
      }
    };
    return chains[chainId as keyof typeof chains];
  }
}

// Individual wallet implementations
class MetaMaskWallet extends EVMWalletBase {
  constructor() {
    super('MetaMask', 'metamask', getWalletProvider('MetaMask'));
  }
}

class SubWallet extends EVMWalletBase {
  constructor() {
    super('SubWallet', 'subwallet', getWalletProvider('SubWallet'));
  }
}

class TalismanWallet extends EVMWalletBase {
  constructor() {
    super('Talisman', 'talisman', getWalletProvider('Talisman'));
  }
}

class NovaWallet extends EVMWalletBase {
  constructor() {
    super('Nova Wallet', 'nova', getWalletProvider('Nova Wallet'));
  }
}

class CoinbaseWallet extends EVMWalletBase {
  constructor() {
    super('Coinbase Wallet', 'coinbase', getWalletProvider('Coinbase Wallet'));
  }
}

class RabbyWallet extends EVMWalletBase {
  constructor() {
    super('Rabby', 'rabby', getWalletProvider('Rabby'));
  }
}


// WalletConnect implementation
class WalletConnectWallet implements WalletProvider {
  name = 'WalletConnect';
  icon = 'walletconnect';
  private walletConnect: WalletConnectManager | null = null;

  constructor() {
    this.walletConnect = new WalletConnectManager(getDefaultWalletConnectConfig());
  }

  isInstalled(): boolean {
    // WalletConnect is always "available" as it's a protocol
    return true;
  }

  async isConnected(address: string): Promise<boolean> {
    return this.walletConnect?.isConnected() || false;
  }

  async connect(): Promise<string> {
    try {
      if (!this.walletConnect) {
        throw new Error('WalletConnect not initialized');
      }

      const { address } = await this.walletConnect.connect();
      return address;
    } catch (error) {
      Logger.error('WalletConnect connection failed', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.walletConnect) {
      await this.walletConnect.disconnect();
    }
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.walletConnect) {
      throw new Error('WalletConnect not initialized');
    }
    await this.walletConnect.switchChain(chainId);
  }

  getProvider(): EthereumProvider | null {
    return this.walletConnect?.getProvider() as EthereumProvider | null;
  }
}

export function useWallet() {
  // Get all possible wallets
  const getAllWallets = (): WalletProvider[] => {
    return [
      new MetaMaskWallet(),
      new SubWallet(),
      new TalismanWallet(),
      new NovaWallet(),
      new CoinbaseWallet(),
      new RabbyWallet()
    ];
  };

  const getInstalledWallets = (): WalletProvider[] => {
    return getAllWallets().filter(wallet => wallet.isInstalled());
  };

  const getWalletByName = (name: string): WalletProvider | undefined => {
    return getAllWallets().find(wallet => wallet.name === name);
  };

  // Get detected wallet information for UI
  const getDetectedWallets = (): WalletInfo[] => {
    return detectInstalledWallets();
  };

  return {
    getAllWallets,
    getInstalledWallets,
    getWalletByName,
    getDetectedWallets,
    // Legacy support
    wallets: getAllWallets()
  };
}