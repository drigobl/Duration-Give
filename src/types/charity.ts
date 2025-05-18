import { Address, Timestamp, UUID } from './common';
import { TokenAmount } from './blockchain';

export enum CharityStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum CharityCategory {
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  ENVIRONMENT = 'environment',
  POVERTY = 'poverty',
  DISASTER_RELIEF = 'disaster_relief',
  ANIMAL_WELFARE = 'animal_welfare',
  ARTS_CULTURE = 'arts_culture',
  COMMUNITY = 'community'
}

export interface CharityBase {
  readonly id: UUID;
  name: string;
  description: string;
  category: CharityCategory;
  status: CharityStatus;
  walletAddress: Address;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CharityMeta {
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  socialLinks: Partial<Record<'twitter' | 'facebook' | 'instagram' | 'linkedin', string>>;
  documents: CharityDocument[];
}

export interface CharityDocument {
  id: UUID;
  type: 'registration' | 'audit' | 'report';
  url: string;
  verifiedAt?: Timestamp;
}

export interface CharityStats {
  totalDonations: number;
  totalAmount: TokenAmount;
  donorCount: number;
  avgDonation: TokenAmount;
  successRate: number;
  impactMetrics: ImpactMetric[];
}

export interface ImpactMetric {
  id: UUID;
  name: string;
  value: number;
  unit: string;
  category: string;
  timestamp: Timestamp;
}

export interface CharityVerification {
  isVerified: boolean;
  verifiedAt?: Timestamp;
  verifiedBy?: UUID;
  documents: VerificationDocument[];
}

export interface VerificationDocument {
  id: UUID;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: Timestamp;
  verifiedBy?: UUID;
}

export interface Charity extends CharityBase {
  meta: CharityMeta;
  stats: CharityStats;
  verification: CharityVerification;
  campaigns: Campaign[];
}

export interface Campaign {
  readonly id: UUID;
  charityId: UUID;
  title: string;
  description: string;
  targetAmount: TokenAmount;
  currentAmount: TokenAmount;
  startDate: Timestamp;
  endDate: Timestamp;
  status: CampaignStatus;
  updates: CampaignUpdate[];
}

export type CampaignStatus = 
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface CampaignUpdate {
  readonly id: UUID;
  campaignId: UUID;
  title: string;
  content: string;
  createdAt: Timestamp;
  attachments: CampaignAttachment[];
}

export interface CampaignAttachment {
  id: UUID;
  type: 'image' | 'document';
  url: string;
  mimeType: string;
}