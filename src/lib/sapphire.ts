import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { sapphireTestnet, sapphireMainnet } from './wagmi'
import { type WalletClient, type PublicClient } from 'viem'

// Sapphire konfigürasyonu
export const getSapphireConfig = (isTestnet: boolean = true) => {
  const chain = isTestnet ? sapphireTestnet : sapphireMainnet
  
  return {
    chain,
    transport: http(chain.rpcUrls.default.http[0])
  }
}

// Sapphire client oluşturma
export const createSapphireClient = (isTestnet: boolean = true) => {
  const config = getSapphireConfig(isTestnet)
  
  const publicClient = createPublicClient({
    chain: config.chain,
    transport: config.transport
  })

  // Sapphire ile wrap et (gerçek implementation deploy edilince aktif olacak)
  // return sapphire.wrap(publicClient)
  return publicClient
}

// Wallet client oluşturma
export const createSapphireWalletClient = (ethereum: any, isTestnet: boolean = true) => {
  const config = getSapphireConfig(isTestnet)
  
  const walletClient = createWalletClient({
    chain: config.chain,
    transport: custom(ethereum)
  })

  // Sapphire ile wrap et (gerçek implementation deploy edilince aktif olacak)  
  // return sapphire.wrap(walletClient)
  return walletClient
}

// Session Key Smart Contract ABI
export const SESSION_KEY_CONTRACT_ABI = [
  {
    "inputs": [
      { "name": "_appId", "type": "string" },
      { "name": "_sessionKey", "type": "bytes32" },
      { "name": "_validUntil", "type": "uint256" },
      { "name": "_nullifierHash", "type": "bytes32" }
    ],
    "name": "createSession",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_sessionKey", "type": "bytes32" }
    ],
    "name": "verifySession",
    "outputs": [
      { "name": "isValid", "type": "bool" },
      { "name": "appId", "type": "string" },
      { "name": "validUntil", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_sessionKey", "type": "bytes32" }
    ],
    "name": "revokeSession",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "", "type": "bytes32" }
    ],
    "name": "sessions",
    "outputs": [
      { "name": "appId", "type": "string" },
      { "name": "validUntil", "type": "uint256" },
      { "name": "nullifierHash", "type": "bytes32" },
      { "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract adresleri
export const CONTRACT_ADDRESSES = {
  testnet: '0x0c67D5525A3b1EDDdAfF38c32AA4aE4F8c4dB933', // ✅ Sapphire Testnet'e deploy edildi!
  mainnet: '0x' + '0'.repeat(40)  // Placeholder - mainnet deploy edilince güncellenecek
} as const

// Session key oluşturma
export const generateSessionKey = (): string => {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  return '0x' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Confidential storage için basit encryption (demo amaçlı)
export const encryptData = (data: string): string => {
  try {
    // Browser'da basit encoding (gerçek uygulamada Sapphire'ın native encryption'ı kullanılacak)
    return btoa(encodeURIComponent(data))
  } catch (error) {
    console.error('Encryption error:', error)
    return data
  }
}

export const decryptData = (encryptedData: string): string => {
  try {
    // Browser'da basit decoding
    return decodeURIComponent(atob(encryptedData))
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedData
  }
}

// Sapphire-specific functions (contract deploy edilince aktif olacak)
export const useSapphireEncryption = () => {
  // TODO: Gerçek Sapphire encryption implementation
  return {
    encrypt: encryptData,
    decrypt: decryptData
  }
} 