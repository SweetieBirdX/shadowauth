export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface App {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  userId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface SessionKey {
  id: string;
  appId: string;
  userId?: string;
  key: string;
  expiresAt: Date;
  createdAt: Date;
  isValid: boolean;
}

export interface ZKProof {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
}

export interface LoginRequest {
  appId: string;
  zkProof: ZKProof;
  actionId?: string;
}

export interface LoginResponse {
  success: boolean;
  sessionKey?: string;
  validUntil?: number;
  txHash?: string;
  error?: string;
}

// ROFL ve Sapphire entegrasyonu için yeni tipler
export interface ROFLSession {
  sessionKey: string;
  appId: string;
  validUntil: number;
  nullifierHash: string;
  isActive: boolean;
  createdAt: number;
  txHash?: string;
}

export interface SapphireContractSession {
  appId: string;
  validUntil: bigint;
  nullifierHash: string;
  isActive: boolean;
}

export interface SessionVerifyRequest {
  sessionKey: string;
  appId?: string;
}

export interface SessionVerifyResponse {
  success: boolean;
  session?: {
    appId: string;
    validUntil?: number;
    createdAt?: Date;
    expiresAt?: Date;
    isValid: boolean;
    source: 'rofl' | 'sapphire' | 'fallback';
  };
  error?: string;
}

export interface AnalyticsEvent {
  appId: string;
  event: string;
  metadata?: any;
  timestamp: number;
  network: 'testnet' | 'mainnet';
}

export interface AppStats {
  totalLogins: number;
  activeUsers: number;
  dailyLogins: number[];
  weeklyLogins: number[];
  monthlyLogins: number[];
}

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}; 