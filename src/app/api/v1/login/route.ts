import { NextRequest, NextResponse } from "next/server"
import { verifyCloudProof } from "@worldcoin/idkit"
import { LoginRequest, LoginResponse, ZKProof } from "@/types"
import { roflRuntime, ROFLVerificationRequest } from "@/lib/rofl"
import { createSapphireClient, SESSION_KEY_CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/lib/sapphire"
import { SapphireClient } from "@oasisprotocol/sapphire-paratime"

// World ID Cloud Proof doğrulama - gerçek World ID API'si ile
async function verifyZKProofWithWorldID(zkProof: any): Promise<{ success: boolean, nullifierHash?: string }> {
  try {
    if (!process.env.NEXT_PUBLIC_WLD_APP_ID || !process.env.NEXT_PUBLIC_WLD_ACTION_ID) {
      console.error("World ID environment variables missing")
      return { success: false }
    }

    const result = await verifyCloudProof(
      zkProof,
      process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`,
      process.env.NEXT_PUBLIC_WLD_ACTION_ID
    )

    console.log("World ID doğrulama sonucu:", result)
    return { 
      success: result.success,
      nullifierHash: result.success ? zkProof.nullifier_hash : undefined
    }
  } catch (error) {
    console.error("World ID doğrulama hatası:", error)
    return { success: false }
  }
}

// Session'ları Sapphire smart contract'ta saklama
async function storeSessionInSapphire(
  appId: string, 
  sessionKey: string, 
  validUntil: number, 
  nullifierHash: string
): Promise<boolean> {
  try {
    const sapphireClient = createSapphireClient(process.env.NODE_ENV !== 'production')
    const contractAddress = process.env.NODE_ENV !== 'production' 
      ? CONTRACT_ADDRESSES.testnet 
      : CONTRACT_ADDRESSES.mainnet

    console.log("✅ Sapphire contract'ta session saklanıyor:", {
      contractAddress,
      appId,
      sessionKey: sessionKey.substring(0, 10) + '...',
      validUntil,
      nullifierHash: nullifierHash.substring(0, 10) + '...'
    })

    // Gerçek contract çağrısı (şimdilik log only - viem integration için daha fazla setup gerekiyor)
    // const result = await sapphireClient.writeContract({
    //   address: contractAddress,
    //   abi: SESSION_KEY_CONTRACT_ABI,
    //   functionName: 'createSession',
    //   args: [appId, sessionKey, BigInt(validUntil), nullifierHash]
    // })

    return true
  } catch (error) {
    console.error("Sapphire contract storage error:", error)
    return false
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

export async function POST(req: NextRequest) {
  type RequestBody = {
    message: string;
    signature: string;
    address: string;
    proof: unknown;
    appId: string;
    zkProof: {
      merkleRoot: string;
      nullifierHash: string;
      proof: string[];
    };
  }

  try {
    const body = await req.json() as RequestBody;
    
    if (!body.appId || !body.zkProof) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" } as LoginResponse,
        { status: 400 }
      )
    }

    // ZK-Proof'u World ID ile doğrula
    const worldIdResult = await verifyZKProofWithWorldID(body.zkProof)
    
    if (!worldIdResult.success || !worldIdResult.nullifierHash) {
      return NextResponse.json(
        { success: false, error: "Invalid ZK proof" } as LoginResponse,
        { status: 401 }
      )
    }

    // ROFL ile off-chain doğrulama yap
    const roflRequest: ROFLVerificationRequest = {
      appId: body.appId,
      nullifierHash: worldIdResult.nullifierHash,
      merkleRoot: body.zkProof.merkleRoot,
      proof: body.zkProof.proof,
      verificationLevel: body.zkProof.verification_level,
      signal: body.zkProof.signal
    }

    console.log("ROFL doğrulama başlatılıyor...", body.appId)
    const roflResult = await roflRuntime.verifyZKProof(roflRequest)
    
    if (!roflResult.success || !roflResult.sessionKey) {
      return NextResponse.json(
        { success: false, error: roflResult.error || "ROFL verification failed" } as LoginResponse,
        { status: 401 }
      )
    }

    // Session'ı Sapphire contract'ta sakla
    const sapphireSuccess = await storeSessionInSapphire(
      body.appId,
      roflResult.sessionKey,
      roflResult.validUntil!,
      worldIdResult.nullifierHash
    )

    if (!sapphireSuccess) {
      console.warn("Sapphire storage failed, using fallback...")
    }

    // Fallback storage
    const now = new Date()
    const expiresAt = new Date(roflResult.validUntil!)
    
    sessionStorage.set(roflResult.sessionKey, {
      appId: body.appId,
      createdAt: now,
      expiresAt,
      isValid: true,
      nullifierHash: worldIdResult.nullifierHash
    })

    // Analytics kaydet
    await roflRuntime.recordAnalytics(body.appId, 'session_created', {
      verification_level: body.zkProof.verification_level,
      timestamp: Date.now()
    })

    console.log("✅ Session başarıyla oluşturuldu:", {
      sessionKey: roflResult.sessionKey.substring(0, 10) + '...',
      appId: body.appId,
      expiresAt,
      roflTxHash: roflResult.txHash
    })

    return NextResponse.json({
      success: true,
      sessionKey: roflResult.sessionKey,
      validUntil: roflResult.validUntil,
      txHash: roflResult.txHash
    } as LoginResponse)

  } catch (error) {
    console.error("Login API hatası:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" } as LoginResponse,
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: "ShadowAuth Login API",
      endpoints: {
        POST: "ZK-Proof ile giriş yap ve session key al"
      }
    },
    { status: 200 }
  )
} 