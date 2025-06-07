import type { EthereumProvider } from '@/types/ethereum';

export interface WalletInfo {
  name: string;
  icon: string;
  provider: EthereumProvider | null;
  installed: boolean;
  priority: number; // Lower number = higher priority
}

/**
 * Detects installed EVM wallets and returns their providers
 * Handles cases where multiple wallets are installed
 */
export function detectInstalledWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = [];

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return wallets;
  }

  // Helper function to safely check window properties
  const getProvider = (path: string): EthereumProvider | null => {
    try {
      const parts = path.split('.');
      let obj: any = window;
      for (const part of parts) {
        obj = obj?.[part];
      }
      return obj || null;
    } catch {
      return null;
    }
  };

  // Helper function to check if a provider is available and not conflicting
  const isWalletProvider = (provider: any, walletType: string): boolean => {
    if (!provider) return false;
    
    switch (walletType) {
      case 'SubWallet':
        return provider.isSubWallet === true;
      case 'Talisman':
        return provider.isTalisman === true;
      case 'NovaWallet':
        return provider.isNovaWallet === true;
      case 'Rabby':
        return provider.isRabby === true;
      case 'MetaMask':
        return provider.isMetaMask === true && !provider.isSubWallet && !provider.isTalisman && !provider.isNovaWallet && !provider.isRabby;
      case 'CoinbaseWallet':
        return provider.isCoinbaseWallet === true;
      default:
        return false;
    }
  };

  // Check each wallet type in priority order
  const walletConfigs = [
    { name: 'SubWallet', icon: 'subwallet', priority: 1, paths: ['SubWallet', 'ethereum'] },
    { name: 'Talisman', icon: 'talisman', priority: 2, paths: ['talismanEth', 'ethereum'] },
    { name: 'Nova Wallet', icon: 'nova', priority: 3, paths: ['novaWallet', 'ethereum'] },
    { name: 'Rabby', icon: 'rabby', priority: 4, paths: ['rabby', 'ethereum'] },
    { name: 'MetaMask', icon: 'metamask', priority: 5, paths: ['ethereum'] },
    { name: 'Coinbase Wallet', icon: 'coinbase', priority: 6, paths: ['ethereum'] }
  ];

  for (const config of walletConfigs) {
    let foundProvider = null;
    
    // Check each possible path for this wallet
    for (const path of config.paths) {
      const provider = getProvider(path);
      if (provider && isWalletProvider(provider, config.name)) {
        foundProvider = provider;
        break;
      }
    }

    if (foundProvider) {
      wallets.push({
        name: config.name,
        icon: config.icon,
        provider: foundProvider,
        installed: true,
        priority: config.priority
      });
    }
  }

  // Sort by priority and remove duplicates
  const uniqueWallets = wallets.reduce((acc, wallet) => {
    const existing = acc.find(w => w.name === wallet.name);
    if (!existing || wallet.priority < existing.priority) {
      return [...acc.filter(w => w.name !== wallet.name), wallet];
    }
    return acc;
  }, [] as WalletInfo[]);

  return uniqueWallets.sort((a, b) => a.priority - b.priority);
}

/**
 * Gets the preferred provider for a specific wallet
 * Handles conflicts when multiple wallets inject into window.ethereum
 */
export function getWalletProvider(walletName: string): EthereumProvider | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const detectedWallets = detectInstalledWallets();
  const wallet = detectedWallets.find(w => w.name === walletName);
  return wallet?.provider || null;
}

/**
 * Checks if a specific wallet is installed
 */
export function isWalletInstalled(walletName: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const detectedWallets = detectInstalledWallets();
  return detectedWallets.some(w => w.name === walletName);
}

/**
 * Returns information about all possible wallets (installed and not installed)
 */
export function getAllWalletInfo(): WalletInfo[] {
  const detected = detectInstalledWallets();
  const allWallets = [
    'MetaMask',
    'SubWallet', 
    'Talisman',
    'Nova Wallet',
    'Coinbase Wallet',
    'Rabby'
  ];

  return allWallets.map(name => {
    const detected_wallet = detected.find(w => w.name === name);
    if (detected_wallet) {
      return detected_wallet;
    }

    // Return info for non-installed wallets
    const iconMap: Record<string, string> = {
      'MetaMask': 'metamask',
      'SubWallet': 'subwallet',
      'Talisman': 'talisman',
      'Nova Wallet': 'nova',
      'Coinbase Wallet': 'coinbase',
      'Rabby': 'rabby'
    };

    return {
      name,
      icon: iconMap[name] || 'metamask',
      provider: null,
      installed: false,
      priority: allWallets.indexOf(name) + 1
    };
  });
}