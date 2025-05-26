import { UUID, Address, Timestamp } from './common';

export enum VolunteerOpportunityStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum VolunteerApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum VolunteerHoursStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum CommitmentType {
  ONE_TIME = 'one-time',
  SHORT_TERM = 'short-term',
  LONG_TERM = 'long-term'
}

export enum OpportunityType {
  ONSITE = 'onsite',
  REMOTE = 'remote',
  HYBRID = 'hybrid'
}

export enum WorkLanguage {
  ENGLISH = 'english',
  SPANISH = 'spanish',
  GERMAN = 'german',
  FRENCH = 'french',
  JAPANESE = 'japanese',
  CHINESE_SIMPLIFIED = 'chinese_simplified',
  CHINESE_TRADITIONAL = 'chinese_traditional',
  THAI = 'thai',
  VIETNAMESE = 'vietnamese',
  KOREAN = 'korean',
  ARABIC = 'arabic',
  HINDI = 'hindi',
  MULTIPLE = 'multiple'
}

export interface VolunteerOpportunity {
  id: UUID;
  charityId: UUID;
  title: string;
  description: string;
  skills: string[];
  commitment: CommitmentType;
  location: string;
  type: OpportunityType;
  status: VolunteerOpportunityStatus;
  workLanguage: WorkLanguage;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VolunteerApplication {
  id: UUID;
  opportunityId: UUID;
  applicantId: UUID;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth?: string;
  availability: {
    days: string[];
    times: string[];
  };
  commitmentType: CommitmentType;
  experience?: string;
  skills?: string[];
  certifications?: string[];
  interests?: string[];
  referenceContacts?: {
    name: string;
    contact: string;
  }[];
  workSamples?: string[];
  status: VolunteerApplicationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  acceptanceHash?: string; // Hash created when application is accepted
}

export interface VolunteerHours {
  id: UUID;
  volunteerId: UUID;
  charityId: UUID;
  opportunityId?: UUID;
  hours: number;
  description?: string;
  datePerformed: string;
  status: VolunteerHoursStatus;
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: UUID;
  verificationHash?: string; // Hash created when hours are verified
}

export interface VolunteerVerification {
  id: UUID;
  applicantId: UUID;
  opportunityId: UUID;
  charityId: UUID;
  acceptanceHash: string; // Hash for application acceptance
  verificationHash?: string; // Hash for hours verification
  acceptedAt: Timestamp;
  verifiedAt?: Timestamp;
  blockchainReference?: {
    network: string;
    transactionId: string;
    blockNumber: number;
  };
}