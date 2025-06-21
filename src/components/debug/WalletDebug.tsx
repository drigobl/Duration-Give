import React, { useEffect, useState } from 'react';
import { detectInstalledWallets } from '@/utils/walletDetection';

export function WalletDebug() {
  const [walletInfo, setWalletInfo] = useState<any>({});

  useEffect(() => {
    const checkWallets = () => {
      const info = {
        hasEthereum: !!window.ethereum,
        ethereumIsMetaMask: window.ethereum?.isMetaMask,
        ethereumIsSubWallet: window.ethereum?.isSubWallet,
        ethereumIsTalisman: window.ethereum?.isTalisman,
        ethereumIsNovaWallet: window.ethereum?.isNovaWallet,
        ethereumIsRabby: window.ethereum?.isRabby,
        ethereumIsCoinbase: window.ethereum?.isCoinbaseWallet,
        hasSubWallet: !!window.SubWallet,
        hasTalismanEth: !!window.talismanEth,
        hasNovaWallet: !!window.novaWallet,
        hasRabby: !!window.rabby,
        detectedWallets: detectInstalledWallets()
      };
      
      console.log('Wallet Debug Info:', info);
      setWalletInfo(info);
    };

    checkWallets();
    
    // Check again after a delay in case wallets inject late
    const timeout = setTimeout(checkWallets, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono">
      <h3 className="text-sm font-bold mb-2">Wallet Debug Info</h3>
      <pre>{JSON.stringify(walletInfo, null, 2)}</pre>
    </div>
  );
}