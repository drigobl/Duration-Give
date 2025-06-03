import { ReactNode, CSSProperties } from 'react';
import { Charity, Campaign, CharityCategory } from './charity';
import { TokenAmount } from './blockchain';

// Base Component Props
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  testId?: string;
  children?: ReactNode;
}

// Charity Component Props
export interface CharityCardProps extends BaseComponentProps {
  charity: Charity;
  onDonate?: (charityId: string) => void;
  onShare?: (charityId: string) => void;
  showStats?: boolean;
  compact?: boolean;
}

export interface CharityListProps extends BaseComponentProps {
  charities: Charity[];
  loading?: boolean;
  error?: Error;
  onCharityClick?: (charity: Charity) => void;
  layout?: 'grid' | 'list';
  showPagination?: boolean;
}

export interface CharityFilterProps extends BaseComponentProps {
  categories: CharityCategory[];
  selectedCategories: CharityCategory[];
  onCategoryChange: (categories: CharityCategory[]) => void;
  showVerifiedOnly: boolean;
  onVerifiedChange: (verified: boolean) => void;
}

// Campaign Component Props
export interface CampaignCardProps extends BaseComponentProps {
  campaign: Campaign;
  onDonate?: (campaignId: string) => void;
  showProgress?: boolean;
  showTimeLeft?: boolean;
}

export interface CampaignListProps extends BaseComponentProps {
  campaigns: Campaign[];
  loading?: boolean;
  error?: Error;
  onCampaignClick?: (campaign: Campaign) => void;
  layout?: 'grid' | 'list';
}

// Form Component Props
export interface DonationFormProps extends BaseComponentProps {
  charityId: string;
  campaignId?: string;
  onSubmit: (amount: TokenAmount) => Promise<void>;
  onCancel?: () => void;
  minAmount?: TokenAmount;
  maxAmount?: TokenAmount;
}

// Context Types
export interface CharityContextType {
  selectedCharity?: Charity;
  setSelectedCharity: (charity?: Charity) => void;
  loading: boolean;
  error?: Error;
}

export interface DonationContextType {
  pendingDonations: PendingDonation[];
  addDonation: (donation: Omit<PendingDonation, 'status'>) => void;
  removeDonation: (donationId: string) => void;
}

export interface PendingDonation {
  id: string;
  charityId: string;
  campaignId?: string;
  amount: TokenAmount;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// UI Component Props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}