"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function DocsPage() {
  const router = useRouter()

  const handleTitleClick = () => {
    router.push("/?section=how-it-works")
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="space-y-6 sm:space-y-8">
          {/* Title */}
          <div className="text-center sm:text-left">
            <h1 
              onClick={handleTitleClick}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white cursor-pointer hover:text-indigo-400 transition-colors"
            >
              ShadowAuth Documentation
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-400">
              ShadowAuth provides privacy-focused authentication using World ID and Oasis ROFL technologies.
            </p>
          </div>

          <Separator className="bg-slate-800" />

          {/* Overview */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Overview</h2>
            <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800">
              <p className="text-sm sm:text-base text-slate-300">
                ShadowAuth works by verifying users&apos; identities with World ID and creating off-chain session keys on ROFL. 
                This allows users to log into dApps without sharing their wallet addresses or other sensitive information.
              </p>
            </Card>
          </section>

          {/* Architecture */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Architecture</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">1. World ID Integration</h3>
                <p className="text-sm sm:text-base text-slate-300">
                  - User verifies identity with World ID<br />
                  - ZK-Proof and nullifier hash are generated<br />
                  - Verification is done with cloud-proof
                </p>
              </Card>

              <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">2. ROFL (Runtime OFFchain Logic)</h3>
                <p className="text-sm sm:text-base text-slate-300">
                  - ZK-Proof is verified off-chain in ROFL<br />
                  - Temporary session key is generated<br />
                  - Session information is stored encrypted
                </p>
              </Card>

              <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800 md:col-span-2 lg:col-span-1">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">3. Sapphire ParaTime</h3>
                <p className="text-sm sm:text-base text-slate-300">
                  - Session keys are backed up in Sapphire<br />
                  - Privacy is protected with confidential contract<br />
                  - Session verification is performed
                </p>
              </Card>
            </div>
          </section>

          {/* API Endpoints */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">API Endpoints</h2>
            <div className="grid gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">POST /api/v1/login</h3>
                <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">World ID verification and session creation.</p>
                <pre className="bg-slate-800 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                  <code className="text-slate-300">
{`{
  "appId": "string",
  "zkProof": {
    "merkle_root": "string",
    "nullifier_hash": "string",
    "proof": "string",
    "verification_level": "string"
  }
}`}
                  </code>
                </pre>
              </Card>

              <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">POST /api/v1/session/verify</h3>
                <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">Session key verification.</p>
                <pre className="bg-slate-800 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                  <code className="text-slate-300">
{`{
  "sessionKey": "string",
  "appId": "string"
}`}
                  </code>
                </pre>
              </Card>
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Security Features</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800 md:col-span-2">
                <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm sm:text-base text-slate-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    ZK-Proof based authentication
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Off-chain session management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Encrypted data storage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Temporary session keys
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Sapphire confidential contracts
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Testing and Development */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Testing and Development</h2>
            <Card className="p-4 sm:p-6 bg-slate-900/50 border-slate-800">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 text-sm sm:text-base text-slate-300">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 mt-1.5"></span>
                  <span>ROFL testnet is used</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Quick testing with mock responses</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Debug logs provide detailed information</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 mt-1.5"></span>
                  <span>Session storage fallback mechanism available</span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
} 