import { Logger } from '@/utils/logger';
import { CHAIN_IDS } from '@/config/contracts';
import type { EthereumProvider, AddEthereumChainParameter } from '@/types/ethereum';
import { isEthereumError } from '@/types/ethereum';

interface WalletProvider {
  name: string;
  icon: string;
  isInstalled: () => boolean;
  isConnected: (address: string) => Promise<boolean>;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number | string) => Promise<void>;
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
        throw new Error('Wallet provider not found');
      }
      
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (!accounts?.length) {
        throw new Error('No accounts found');
      }

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
        throw new Error('Wallet provider not found');
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
      throw new Error('Wallet provider not found');
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

class MetaMaskWallet extends EVMWalletBase {
  constructor() {
    super('MetaMask', 'metamask', window.ethereum?.isMetaMask ? window.ethereum : null);
  }

  isInstalled(): boolean {
    return typeof window.ethereum?.isMetaMask !== 'undefined';
  }
}

class CoinbaseWallet extends EVMWalletBase {
  constructor() {
    super('Coinbase Wallet', 'coinbase', window.ethereum?.isCoinbaseWallet ? window.ethereum : null);
  }

  isInstalled(): boolean {
    return typeof window.ethereum?.isCoinbaseWallet !== 'undefined';
  }
}

class TallyWallet extends EVMWalletBase {
  constructor() {
    super('Tally', 'tally', window.ethereum?.isTally ? window.ethereum : null);
  }

  isInstalled(): boolean {
    return typeof window.ethereum?.isTally !== 'undefined';
  }
}

class BraveWallet extends EVMWalletBase {
  constructor() {
    super('Brave', 'brave', window.ethereum?.isBraveWallet ? window.ethereum : null);
  }

  isInstalled(): boolean {
    return typeof window.ethereum?.isBraveWallet !== 'undefined';
  }
}

interface PolkadotInjector {
  signer: {
    signPayload?: (payload: unknown) => Promise<unknown>;
  };
}

class PolkadotWallet implements WalletProvider {
  name = 'Polkadot';
  icon = 'polkadot';
  private injector: PolkadotInjector | null = null;
  private extensions: Array<{ name: string; version: string }> = [];

  async initialize() {
    // Polkadot.js extension functionality removed
  }

  isInstalled(): boolean {
    return false;
  }

  async isConnected(address: string): Promise<boolean> {
    return false;
  }

  async connect(): Promise<string> {
    throw new Error('Polkadot wallet connection not implemented');
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async switchChain(chainId: string): Promise<void> {
    Logger.info('Chain switch requested', { chain: chainId });
  }
}

export function useWallet() {
  const wallets: WalletProvider[] = [
    new MetaMaskWallet(),
    new CoinbaseWallet(),
    new TallyWallet(),
    new BraveWallet(),
    new PolkadotWallet()
  ];

  const getInstalledWallets = () => {
    return wallets.filter(wallet => wallet.isInstalled());
  };

  return {
    getInstalledWallets,
    wallets
  };
}