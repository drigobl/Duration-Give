import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, ChevronDown, LogOut, AlertTriangle, ExternalLink, RefreshCw, User, Download } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '../ui/Button';
import { shortenAddress } from '@/utils/web3';
import { Logger } from '@/utils/logger';
import { CHAIN_IDS } from '@/config/contracts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletAlias } from '@/hooks/useWalletAlias';

const CONNECTION_TIMEOUT = 30000; // 30 seconds
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

// Wallet icon component with official logos
const WalletIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = "w-8 h-8" }) => {
  // Map wallet icons to their correct file paths
  const walletLogos: Record<string, string> = {
    'metamask': '/icons/metamask.svg',
    'coinbase': '/icons/coinbase.svg', 
    'subwallet': '/icons/subwallet.svg', // Official SubWallet logo
    'talisman': '/icons/talisman.svg',   // Official Talisman logo
    'nova': '/icons/nova.svg',           // Official Nova Wallet logo
    'rabby': '/icons/rabby.svg'          // Official Rabby logo
  };

  return (
    <img 
      src={walletLogos[icon] || `/icons/${icon}.svg`}
      alt=""
      className={className}
      onError={(e) => {
        console.log(`Failed to load wallet icon: ${icon}`);
        // Fallback to metamask if specific wallet icon fails
        (e.target as HTMLImageElement).src = '/icons/metamask.svg';
      }}
    />
  );
};

// Wallet download links
const WALLET_DOWNLOAD_LINKS: Record<string, string> = {
  'MetaMask': 'https://metamask.io/download/',
  'SubWallet': 'https://www.subwallet.app/download.html',
  'Talisman': 'https://www.talisman.xyz/download',
  'Nova Wallet': 'https://novawallet.io/',
  'Coinbase Wallet': 'https://www.coinbase.com/wallet',
  'Rabby': 'https://rabby.io/'
};

export function ConnectButton() {
  const { 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect, 
    address, 
    error, 
    chainId, 
    switchChain,
    connectedWallet,
    availableWallets
  } = useWeb3();
  const { logout } = useAuth();
  const { alias } = useWalletAlias();
  const navigate = useNavigate();
  
  const [showWalletSelect, setShowWalletSelect] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWalletSelect || showAccountMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.wallet-dropdown')) {
          setShowWalletSelect(false);
          setShowAccountMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWalletSelect, showAccountMenu]);

  const handleConnect = useCallback(() => {
    setConnectionError(null);
    setRetryCount(0);
    setIsRetrying(false);
    setShowWalletSelect(true);
  }, []);

  const handleWalletSelect = useCallback(async (walletName: string) => {
    try {
      setConnectionError(null);
      setIsRetrying(false);
      
      const timeoutId = setTimeout(() => {
        setConnectionError('Connection timeout. Please try again.');
        setShowWalletSelect(false);
      }, CONNECTION_TIMEOUT);

      await connect(walletName);
      clearTimeout(timeoutId);
      setShowWalletSelect(false);

      // Check if connected to supported network
      if (chainId && !isSupportedChainId(chainId)) {
        try {
          await switchChain(CHAIN_IDS.MOONBASE);
        } catch (switchError) {
          throw new Error('Please switch to Moonbase Alpha (TestNet)');
        }
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setConnectionError(`Wallet connection failed: ${message}`);
      Logger.error('Wallet connection failed', { 
        wallet: walletName,
        error: err,
        retryCount 
      });

      // Only retry if not user rejected
      if (retryCount < MAX_RETRIES && !message.toLowerCase().includes('user rejected')) {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        setTimeout(() => handleWalletSelect(walletName), RETRY_DELAY * Math.pow(2, retryCount));
      }
    }
  }, [connect, chainId, switchChain, retryCount]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      await logout();
      setShowAccountMenu(false);
      setConnectionError(null);
      setRetryCount(0);
      setIsRetrying(false);
      navigate('/login');
    } catch (err) {
      Logger.error('Wallet disconnection failed', { error: err });
      setShowAccountMenu(false);
    }
  }, [disconnect, logout, navigate]);

  const handleManageAlias = useCallback(() => {
    setShowAccountMenu(false);
    navigate('/give-dashboard', { state: { showWalletSettings: true } });
  }, [navigate]);

  const getExplorerUrl = useCallback(() => {
    if (!address) return '#';
    
    const explorers = {
      [CHAIN_IDS.MOONBASE]: 'https://moonbase.moonscan.io/address/',
      [CHAIN_IDS.MOONBEAM]: 'https://moonscan.io/address/',
      [CHAIN_IDS.ASTAR]: 'https://blockscout.com/astar/address/',
      [CHAIN_IDS.POLYGON]: 'https://polygonscan.com/address/'
    };

    return `${explorers[chainId as keyof typeof explorers] || explorers[CHAIN_IDS.MOONBASE]}${address}`;
  }, [address, chainId]);

  // Group wallets by installation status
  const installedWallets = availableWallets.filter(wallet => wallet.installed);
  const notInstalledWallets = availableWallets.filter(wallet => !wallet.installed);

  if (connectionError || error) {
    return (
      <Button
        onClick={handleConnect}
        variant="secondary"
        size="sm"
        className="text-red-600 shadow-sm hover:shadow-md rounded-md px-4 py-2 transition-all duration-200"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">{connectionError || error.message}</span>
        <span className="sm:hidden">Error</span>
        {isRetrying && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="relative wallet-dropdown">
        <Button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          variant="secondary"
          size="sm"
          className="flex items-center shadow-sm hover:shadow-md rounded-md px-4 py-2 transition-all duration-200"
          aria-expanded={showAccountMenu}
          aria-haspopup="true"
        >
          <Wallet className="h-4 w-4 mr-2" />
          <span className="mr-1">{alias || shortenAddress(address)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        {showAccountMenu && (
          <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 divide-y divide-gray-100 z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Connected with {connectedWallet || 'Wallet'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{shortenAddress(address)}</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(address)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                  >
                    Copy
                  </button>
                  <a 
                    href={getExplorerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleManageAlias}
                className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md"
                role="menuitem"
              >
                <User className="h-4 w-4 mr-2" />
                {alias ? 'Change Wallet Alias' : 'Set Wallet Alias'}
              </button>
              <button
                onClick={handleDisconnect}
                className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors rounded-md"
                role="menuitem"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative wallet-dropdown">
      <Button
        onClick={handleConnect}
        variant="primary"
        size="sm"
        disabled={isConnecting}
        className="flex items-center shadow-sm hover:shadow-md rounded-md px-4 py-2 transition-all duration-200"
        aria-expanded={showWalletSelect}
        aria-haspopup="true"
      >
        <Wallet className="h-4 w-4 mr-2" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        {isRetrying && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
      </Button>

      {showWalletSelect && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose your preferred wallet provider
            </p>
          </div>
          
          {/* Installed Wallets */}
          {installedWallets.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Installed Wallets
              </div>
              {installedWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletSelect(wallet.name)}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md group"
                  role="menuitem"
                >
                  <WalletIcon icon={wallet.icon} className="w-8 h-8 mr-3" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-medium text-gray-900">{wallet.name}</span>
                    <span className="text-xs text-gray-500">Connect to your {wallet.name} wallet</span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2" title="Installed" />
                </button>
              ))}
            </div>
          )}

          {/* Not Installed Wallets */}
          {notInstalledWallets.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                More Wallet Options
              </div>
              {notInstalledWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-400 rounded-md"
                >
                  <WalletIcon icon={wallet.icon} className="w-8 h-8 mr-3 opacity-50" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-medium text-gray-500">{wallet.name}</span>
                    <span className="text-xs text-gray-400">Not installed</span>
                  </div>
                  {WALLET_DOWNLOAD_LINKS[wallet.name] && (
                    <a
                      href={WALLET_DOWNLOAD_LINKS[wallet.name]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-indigo-500 hover:text-indigo-600 transition-colors"
                      title={`Install ${wallet.name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {installedWallets.length === 0 && (
            <div className="p-4 text-center">
              <div className="text-gray-500 mb-2">
                <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-gray-900 mb-1">No wallets detected</p>
                <p className="text-sm">Install a wallet to get started</p>
              </div>
              <a
                href={WALLET_DOWNLOAD_LINKS['MetaMask']}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors mt-2"
              >
                <Download className="h-4 w-4 mr-1" />
                Install MetaMask
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function isSupportedChainId(chainId: number | string): boolean {
  return Object.values(CHAIN_IDS).includes(Number(chainId));
}