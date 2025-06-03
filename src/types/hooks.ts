import { Charity, Campaign, CharityCategory } from './charity';
import { TokenAmount, TransactionHash } from './blockchain';
import { ApiError, QueryOptions } from './common';

// Data Fetching Hooks
export interface UseCharityResult {
  charity?: Charity;
  loading: boolean;
  error?: ApiError;
  refetch: () => Promise<void>;
}

export interface UseCampaignResult {
  campaign?: Campaign;
  loading: boolean;
  error?: ApiError;
  refetch: () => Promise<void>;
}

export interface UseInfiniteDataOptions<T> extends QueryOptions {
  fetchFn: (options: QueryOptions) => Promise<T[]>;
  pageSize?: number;
  initialData?: T[];
}

export interface UseInfiniteDataResult<T> {
  data: T[];
  loading: boolean;
  error?: Error;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Web3 Hooks
export interface UseWalletResult {
  address?: string;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error?: Error;
}

export interface UseDonationResult {
  donate: (amount: TokenAmount, charityId: string) => Promise<TransactionHash>;
  loading: boolean;
  error?: Error;
}

export interface UseTransactionResult {
  hash?: TransactionHash;
  status: 'pending' | 'confirmed' | 'failed';
  loading: boolean;
  error?: Error;
}

// Form Hooks
export interface UseFormResult<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  isDirty: boolean;
  resetForm: () => void;
}

// Filter Hooks
export interface UseFiltersResult {
  filters: {
    search: string;
    categories: CharityCategory[];
    verifiedOnly: boolean;
  };
  setSearch: (search: string) => void;
  setCategories: (categories: CharityCategory[]) => void;
  setVerifiedOnly: (verified: boolean) => void;
  resetFilters: () => void;
}