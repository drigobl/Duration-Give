/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isTally?: boolean;
    isBraveWallet?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    removeAllListeners: (event: string) => void;
    disconnect?: () => Promise<void>;
  };
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_DONATION_CONTRACT_ADDRESS: string;
  readonly VITE_TOKEN_CONTRACT_ADDRESS: string;
  readonly VITE_VERIFICATION_CONTRACT_ADDRESS: string;
  readonly VITE_DISTRIBUTION_CONTRACT_ADDRESS: string;
  readonly VITE_NETWORK: string;
  readonly VITE_NETWORK_ENDPOINT: string;
  readonly VITE_ENABLE_GOOGLE_AUTH: string;
  readonly VITE_ENABLE_MAGIC_LINKS: string;
  readonly VITE_MAX_LOGIN_ATTEMPTS: string;
  readonly VITE_LOGIN_COOLDOWN_MINUTES: string;
  readonly VITE_CACHE_TTL_MINUTES: string;
  readonly VITE_API_TIMEOUT_MS: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ANALYTICS_SAMPLE_RATE: string;
  readonly VITE_MONITORING_API_KEY?: string;
  readonly VITE_MONITORING_APP_ID?: string;
  readonly VITE_MONITORING_ENVIRONMENT?: string;
  readonly VITE_MONITORING_ENABLED_MONITORS?: string;
  readonly VITE_MONITORING_ENDPOINT?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_MOONBASE_RPC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}