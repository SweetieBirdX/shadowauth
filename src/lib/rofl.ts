// ROFL (Runtime OFFchain Logic) entegrasyonu
// Bu dosya off-chain doğrulama işlemlerini yönetir

import { generateSessionKey, encryptData } from './sapphire'

// ROFL endpoint konfigürasyonu
export const ROFL_ENDPOINTS = {
  testnet: process.env.NEXT_PUBLIC_ROFL_TESTNET_ENDPOINT || 'https://rofl-testnet.shadowauth.oasis.io',
  mainnet: process.env.NEXT_PUBLIC_ROFL_MAINNET_ENDPOINT || 'https://rofl.shadowauth.oasis.io'
}

// ROFL request/response tipleri
export interface ROFLVerificationRequest {
  appId: string
  nullifierHash: string
  merkleRoot: string
  proof: string
  verificationLevel: string
  signal?: string
}

export interface ROFLVerificationResponse {
  success: boolean
  sessionKey?: string
  validUntil?: number
  error?: string
  txHash?: string
}

export interface ROFLSessionRequest {
  sessionKey: string
  appId: string
  timestamp: number
}

export interface ROFLSessionResponse {
  isValid: boolean
  appId?: string
  validUntil?: number
  error?: string
}

// ROFL Runtime sınıfı
export class ROFLRuntime {
  private endpoint: string
  private isTestnet: boolean

  constructor(isTestnet: boolean = true) {
    this.isTestnet = isTestnet
    this.endpoint = isTestnet ? ROFL_ENDPOINTS.testnet : ROFL_ENDPOINTS.mainnet
  }

  // World ID ZK-Proof'unu ROFL'da doğrula
  async verifyZKProof(request: ROFLVerificationRequest): Promise<ROFLVerificationResponse> {
    try {
      console.log('ROFL: ZK-Proof doğrulanıyor...', request.appId)
      
      // Development mode'da mock response döndür
      if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ROFL_API_KEY) {
        console.log('ROFL: Development mode - mock response döndürülüyor')
        
        // Session key oluştur
        const sessionKey = generateSessionKey()
        const validUntil = Date.now() + (24 * 60 * 60 * 1000) // 24 saat
        
        console.log('ROFL: Mock session key oluşturuldu:', sessionKey.substring(0, 10) + '...')
        
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 100))
        
        return {
          success: true,
          sessionKey,
          validUntil,
          txHash: `0x${Math.random().toString(16).substring(2, 66)}` // Mock tx hash
        }
      }
      
      // Production mode - gerçek ROFL endpoint'ine gönder
      const response = await fetch(`${this.endpoint}/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ROFL_API_KEY || ''}`,
        },
        body: JSON.stringify({
          ...request,
          timestamp: Date.now(),
          network: this.isTestnet ? 'testnet' : 'mainnet'
        })
      })

      if (!response.ok) {
        throw new Error(`ROFL verification failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        // Session key oluştur
        const sessionKey = generateSessionKey()
        const validUntil = Date.now() + (24 * 60 * 60 * 1000) // 24 saat
        
        console.log('ROFL: Session key oluşturuldu:', sessionKey.substring(0, 10) + '...')
        
        return {
          success: true,
          sessionKey,
          validUntil,
          txHash: result.txHash
        }
      } else {
        return {
          success: false,
          error: result.error || 'Verification failed'
        }
      }
    } catch (error) {
      console.error('ROFL verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Session key'i ROFL'da doğrula
  async verifySession(request: ROFLSessionRequest): Promise<ROFLSessionResponse> {
    try {
      console.log('ROFL: Session doğrulanıyor...', request.sessionKey.substring(0, 10) + '...')
      
      // Development mode'da mock response döndür
      if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ROFL_API_KEY) {
        console.log('ROFL: Development mode - mock session verification')
        
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 50))
        
        return {
          isValid: true,
          appId: request.appId,
          validUntil: Date.now() + (24 * 60 * 60 * 1000) // 24 saat
        }
      }
      
      // Production mode - gerçek ROFL endpoint'ine gönder
      const response = await fetch(`${this.endpoint}/api/session/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ROFL_API_KEY || ''}`,
        },
        body: JSON.stringify({
          ...request,
          network: this.isTestnet ? 'testnet' : 'mainnet'
        })
      })

      if (!response.ok) {
        throw new Error(`ROFL session verification failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        isValid: result.isValid || false,
        appId: result.appId,
        validUntil: result.validUntil,
        error: result.error
      }
    } catch (error) {
      console.error('ROFL session verification error:', error)
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Off-chain storage'da gizli veri saklama
  async storeConfidentialData(sessionKey: string, data: any): Promise<boolean> {
    try {
      // Development mode'da mock response döndür
      if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ROFL_API_KEY) {
        console.log('ROFL: Development mode - mock storage')
        
        // Simulated delay
        await new Promise(resolve => setTimeout(resolve, 50))
        
        return true
      }
      
      // Production mode - gerçek ROFL endpoint'ine gönder
      // Verileri şifrele
      const encryptedData = encryptData(JSON.stringify(data))
      
      const response = await fetch(`${this.endpoint}/api/storage/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ROFL_API_KEY || ''}`,
        },
        body: JSON.stringify({
          sessionKey,
          encryptedData,
          timestamp: Date.now(),
          network: this.isTestnet ? 'testnet' : 'mainnet'
        })
      })

      return response.ok
    } catch (error) {
      console.error('ROFL storage error:', error)
      return false
    }
  }

  // Off-chain analytics ve metrics
  async recordAnalytics(appId: string, event: string, metadata?: any): Promise<void> {
    try {
      // Development mode'da mock response döndür
      if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ROFL_API_KEY) {
        console.log('ROFL: Development mode - mock analytics:', event)
        return
      }
      
      // Production mode - gerçek ROFL endpoint'ine gönder
      await fetch(`${this.endpoint}/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ROFL_API_KEY || ''}`,
        },
        body: JSON.stringify({
          appId,
          event,
          metadata,
          timestamp: Date.now(),
          network: this.isTestnet ? 'testnet' : 'mainnet'
        })
      })
    } catch (error) {
      console.error('ROFL analytics error:', error)
    }
  }
}

// Global ROFL instance
export const roflRuntime = new ROFLRuntime(
  process.env.NODE_ENV !== 'production'
)

// Yardımcı fonksiyonlar
export const isROFLHealthy = async (isTestnet: boolean = true): Promise<boolean> => {
  try {
    const endpoint = isTestnet ? ROFL_ENDPOINTS.testnet : ROFL_ENDPOINTS.mainnet
    const response = await fetch(`${endpoint}/health`)
    return response.ok
  } catch {
    return false
  }
}

export const getROFLVersion = async (isTestnet: boolean = true): Promise<string | null> => {
  try {
    const endpoint = isTestnet ? ROFL_ENDPOINTS.testnet : ROFL_ENDPOINTS.mainnet
    const response = await fetch(`${endpoint}/version`)
    if (response.ok) {
      const data = await response.json()
      return data.version
    }
  } catch {
    // Sessiz fail
  }
  return null
}

// any tiplerini unknown veya daha spesifik tiplerle değiştir
export type RoflResponse<T = unknown> = {
  data?: T;
  error?: unknown;
}

export type RoflError = {
  code: number;
  message: string;
  details?: unknown;
} 