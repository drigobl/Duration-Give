// Ethereum Provider Types

export interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isTally?: boolean;
  isBraveWallet?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
  on?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface AddEthereumChainParameter {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export interface SwitchEthereumChainParameter {
  chainId: string;
}

export interface EthereumError extends Error {
  code: number;
  data?: unknown;
}

// Type guard for Ethereum errors
export function isEthereumError(error: unknown): error is EthereumError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as any).code === 'number'
  );
}

// Global window type extension
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}