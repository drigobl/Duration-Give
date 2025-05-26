import { Address } from './common';

export type NetworkId = number;
export type TransactionHash = string;
export type BlockNumber = number;
export type TokenAmount = string;

export interface BlockchainConfig {
  readonly networkId: NetworkId;
  readonly rpcUrl: string;
  readonly chainId: number;
  readonly explorer: string;
  readonly SUPPORTED_NETWORKS: readonly NetworkId[];
}

export interface Transaction {
  hash: TransactionHash;
  from: Address;
  to: Address;
  value: TokenAmount;
  blockNumber: BlockNumber;
  timestamp: number;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
}

export type TransactionStatus = 
  | 'pending'
  | 'confirmed'
  | 'failed';

export interface TransactionReceipt {
  transactionHash: TransactionHash;
  blockNumber: BlockNumber;
  gasUsed: string;
  status: boolean;
  events: TransactionEvent[];
}

export interface TransactionEvent {
  event: string;
  address: Address;
  returnValues: Record<string, unknown>;
  blockNumber: BlockNumber;
}

export interface Web3Provider {
  readonly name: string;
  readonly icon: string;
  isInstalled(): boolean;
  connect(): Promise<Address>;
  disconnect(): Promise<void>;
  signMessage(message: string): Promise<string>;
  sendTransaction(tx: TransactionRequest): Promise<TransactionHash>;
}

export interface TransactionRequest {
  to: Address;
  value: TokenAmount;
  data?: string;
  gasLimit?: string;
  nonce?: number;
}