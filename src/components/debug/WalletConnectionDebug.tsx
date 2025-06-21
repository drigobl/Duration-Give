import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const WalletConnectionDebug: React.FC = () => {
  const { 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect,
    error, 
    availableWallets,
    address,
    chainId,
    connectedWallet 
  } = useWeb3();
  
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // Check what's available in the window object
    const checkWalletProviders = () => {
      const info: Record<string, unknown> = {
        hasWindow: typeof window !== 'undefined',
        hasEthereum: typeof (window as Record<string, unknown>)?.ethereum !== 'undefined',
        ethereumProviders: {},
        installedWallets: availableWallets,
      };

      if (typeof window !== 'undefined') {
        const w = window as Record<string, unknown> & {
          ethereum?: {
            isMetaMask?: boolean;
            isCoinbaseWallet?: boolean;
            isSubWallet?: boolean;
            isTalisman?: boolean;
            isRabby?: boolean;
            request?: (args: { method: string }) => Promise<unknown>;
            enable?: () => Promise<unknown>;
            on?: (event: string, callback: () => void) => void;
          };
        };
        
        // Check for common wallet providers
        info.ethereumProviders = {
          ethereum: !!w.ethereum,
          metamask: !!w.ethereum?.isMetaMask,
          coinbase: !!w.ethereum?.isCoinbaseWallet,
          subwallet: !!w.ethereum?.isSubWallet,
          talisman: !!w.ethereum?.isTalisman,
          rabby: !!w.ethereum?.isRabby,
        };

        // Check if ethereum provider has required methods
        if (w.ethereum) {
          info.ethereumMethods = {
            request: typeof w.ethereum.request === 'function',
            enable: typeof w.ethereum.enable === 'function',
            on: typeof w.ethereum.on === 'function',
          };
        }
      }

      setDebugInfo(info);
    };

    checkWalletProviders();
  }, [availableWallets]);

  const handleTestConnection = async () => {
    try {
      console.log('🔧 Testing wallet connection...');
      await connect();
      console.log('✅ Connection successful!');
    } catch (error) {
      console.error('❌ Connection failed:', error);
    }
  };

  const handleTestMetaMaskDirect = async () => {
    try {
      console.log('🔧 Testing MetaMask direct connection...');
      
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not detected');
      }

      const ethereum = (window as any).ethereum;
      console.log('MetaMask provider found:', ethereum);
      
      // Check if already connected
      const existingAccounts = await ethereum.request({ method: 'eth_accounts' });
      console.log('Existing accounts:', existingAccounts);
      
      if (existingAccounts.length > 0) {
        console.log('⚠️ MetaMask already connected to:', existingAccounts[0]);
        console.log('This is why no popup appeared - already authorized');
        return;
      }

      // Force request accounts (should trigger popup)
      console.log('Requesting accounts...');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('✅ MetaMask connection successful:', accounts[0]);
      
    } catch (error) {
      console.error('❌ Direct MetaMask test failed:', error);
    }
  };

  const handleTestSpecificWallet = async (walletName: string) => {
    try {
      console.log(`🔧 Testing ${walletName} connection...`);
      await connect(walletName);
      console.log(`✅ ${walletName} connection successful!`);
    } catch (error) {
      console.error(`❌ ${walletName} connection failed:`, error);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Wallet Connection Debug</h3>
      
      {/* Connection Status */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Connection Status:</h4>
        <div className="space-y-1 text-sm">
          <div>Connected: {isConnected ? '✅ Yes' : '❌ No'}</div>
          <div>Connecting: {isConnecting ? '⏳ Yes' : '❌ No'}</div>
          <div>Address: {address || 'None'}</div>
          <div>Chain ID: {chainId || 'None'}</div>
          <div>Connected Wallet: {connectedWallet || 'None'}</div>
          {error && <div className="text-red-600">Error: {error.message}</div>}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Environment Debug:</h4>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {/* Available Wallets */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Available Wallets:</h4>
        <div className="space-y-2">
          {availableWallets.length === 0 ? (
            <p className="text-gray-500">No wallets detected</p>
          ) : (
            availableWallets.map((wallet) => (
              <div key={wallet.name} className="flex items-center justify-between">
                <span className="text-sm">
                  {wallet.name} {wallet.installed ? '✅' : '❌'}
                </span>
                {wallet.installed && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleTestSpecificWallet(wallet.name)}
                    disabled={isConnecting}
                  >
                    Test {wallet.name}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleTestConnection}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Test Default Connection'}
        </Button>

        <Button
          onClick={handleTestMetaMaskDirect}
          variant="secondary"
          className="w-full"
        >
          Test MetaMask Direct (Check Console)
        </Button>

        {isConnected && (
          <Button
            onClick={async () => {
              console.log('🔧 Disconnecting...');
              await disconnect();
              console.log('✅ Disconnected');
            }}
            variant="destructive"
            className="w-full"
          >
            Force Disconnect
          </Button>
        )}

        <Button
          onClick={() => {
            console.log('🔧 Current Web3 state:', {
              isConnected,
              isConnecting,
              address,
              chainId,
              connectedWallet,
              error: error?.message,
              availableWallets
            });
          }}
          variant="secondary"
          className="w-full"
        >
          Log State to Console
        </Button>
      </div>
    </Card>
  );
};