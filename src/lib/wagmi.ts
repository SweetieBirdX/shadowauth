import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// Oasis Sapphire chains
export const sapphireTestnet = {
  id: 0x5aff,
  name: 'Sapphire Testnet',
  nativeCurrency: { name: 'TEST', symbol: 'TEST', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.sapphire.oasis.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.io',
    },
  },
  testnet: true,
} as const

export const sapphireMainnet = {
  id: 0x5afe,
  name: 'Sapphire',
  nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sapphire.oasis.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Explorer',
      url: 'https://explorer.sapphire.oasis.io',
    },
  },
} as const

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [sapphireTestnet, sapphireMainnet, mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    safe(),
    walletConnect({ projectId }),
  ],
  transports: {
    [sapphireTestnet.id]: http(),
    [sapphireMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
} 