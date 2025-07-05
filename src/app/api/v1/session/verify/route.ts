import { NextRequest, NextResponse } from "next/server"
import { roflRuntime, ROFLSessionRequest } from "@/lib/rofl"
import { createSapphireClient, SESSION_KEY_CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/lib/sapphire"

// Sapphire contract'tan session doğrulama
async function verifySessionInSapphire(sessionKey: string): Promise<{
  isValid: boolean,
  appId?: string,
  validUntil?: number
}> {
  try {
    const sapphireClient = createSapphireClient(process.env.NODE_ENV !== 'production')
    const contractAddress = process.env.NODE_ENV !== 'production' 
      ? CONTRACT_ADDRESSES.testnet 
      : CONTRACT_ADDRESSES.mainnet

    console.log("Sapphire contract'ta session doğrulanıyor:", sessionKey.substring(0, 10) + '...')

    // TODO: Gerçek contract çağrısı
    // const result = await sapphireClient.readContract({
    //   address: contractAddress,
    //   abi: SESSION_KEY_CONTRACT_ABI,
    //   functionName: 'verifySession',
    //   args: [sessionKey]
    // })

    // Şimdilik mock response
    return { isValid: true }
  } catch (error) {
    console.error("Sapphire contract verification error:", error)
    return { isValid: false }
  }
}

// Fallback storage (ROFL deploy edilene kadar)
const sessionStorage = new Map<string, {
  appId: string,
  createdAt: Date,
  expiresAt: Date,
  isValid: boolean,
  nullifierHash: string
}>()

type ErrorResponse = {
  error: string;
  details: unknown; // any yerine unknown kullanıyoruz
}

export async function POST(req: NextRequest) {
  try {
    const { sessionKey, appId } = await req.json()
    
    if (!sessionKey) {
      return NextResponse.json(
        { success: false, error: "Session key required" },
        { status: 400 }
      )
    }

    console.log("Session doğrulama başlatılıyor:", sessionKey.substring(0, 10) + '...')

    // 1. ROFL ile off-chain doğrulama
    const roflRequest: ROFLSessionRequest = {
      sessionKey,
      appId: appId || '',
      timestamp: Date.now()
    }

    const roflResult = await roflRuntime.verifySession(roflRequest)
    
    if (!roflResult.isValid) {
      console.log("ROFL doğrulama başarısız:", roflResult.error)
    }

    // 2. Sapphire contract'ta doğrulama
    const sapphireResult = await verifySessionInSapphire(sessionKey)
    
    // 3. Fallback storage'da kontrol
    const session = sessionStorage.get(sessionKey)
    
    // Herhangi bir kaynaktan geçerli session bulunmalı
    let isValid = false
    let sessionData: any = null

    if (roflResult.isValid && roflResult.appId) {
      isValid = true
      sessionData = {
        appId: roflResult.appId,
        validUntil: roflResult.validUntil,
        source: 'rofl'
      }
    } else if (sapphireResult.isValid && sapphireResult.appId) {
      isValid = true
      sessionData = {
        appId: sapphireResult.appId,
        validUntil: sapphireResult.validUntil,
        source: 'sapphire'
      }
    } else if (session) {
      // Fallback storage kontrolü
      const now = new Date()
      
      if (now <= session.expiresAt && session.isValid) {
        // App ID kontrolü (isteğe bağlı)
        if (!appId || session.appId === appId) {
          isValid = true
          sessionData = {
            appId: session.appId,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt,
            isValid: session.isValid,
            source: 'fallback'
          }
        }
      } else {
        // Süresi dolmuş session'ı temizle
        sessionStorage.delete(sessionKey)
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      )
    }

    // Analytics kaydet
    await roflRuntime.recordAnalytics(sessionData.appId, 'session_verified', {
      source: sessionData.source,
      timestamp: Date.now()
    })

    console.log("✅ Session başarıyla doğrulandı:", {
      sessionKey: sessionKey.substring(0, 10) + '...',
      appId: sessionData.appId,
      source: sessionData.source
    })

    return NextResponse.json({
      success: true,
      session: sessionData
    })

  } catch (error) {
    console.error("Session verify API hatası:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: "ShadowAuth Session Verify API",
      endpoints: {
        POST: "Session key doğrula"
      }
    },
    { status: 200 }
  )
} 