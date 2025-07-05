"use client"

import { HeroSection } from "@/components/hero-section"
import { ROFLStatus } from "@/components/rofl-status"
import { Footer } from "@/components/footer"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const section = searchParams.get("section")
    if (section === "how-it-works") {
      const element = document.getElementById("how-it-works")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen gradient-bg grid-pattern">
      <HeroSection />
      
      {/* ROFL Status Section */}
      <section className="py-2 glass-effect border-y border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <ROFLStatus />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
              How It Works?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              ShadowAuth provides a completely private and secure login experience using 
              ZK-Proof, ROFL, and Session Key technologies.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col hover-scale">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 animate-glow">
                    1
                  </div>
                  ZK-Proof Generation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    User verifies their identity with World ID and generates a zero-knowledge proof. 
                    This proof never reveals the user&apos;s wallet address.
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col hover-scale">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 animate-glow">
                    2
                  </div>
                  ROFL Verification
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    ZK-Proof is verified off-chain on the Oasis ROFL network. 
                    This process leaves no trace on the blockchain.
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col hover-scale">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 animate-glow">
                    3
                  </div>
                  Session Key Generation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    If verification is successful, a temporary and anonymous session key is generated. 
                    This key enables secure access to the dApp.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 glass-effect">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
              Features
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Secure your application with ShadowAuth&apos;s advanced features.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              <div className="rounded-xl glass-effect p-8 border-glow hover-scale">
                <h3 className="text-lg font-semibold leading-8 text-white">
                  Developer-Friendly SDK
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  Simple SDK that abstracts complex ZK and blockchain operations. 
                  Can be integrated with just a few lines of code.
                </p>
              </div>
              
              <div className="rounded-xl glass-effect p-8 border-glow hover-scale">
                <h3 className="text-lg font-semibold leading-8 text-white">
                  Zero Trace Policy
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  User wallet address is never shared with the dApp. 
                  All interactions are made with anonymous ZK proofs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Answers to common questions about ShadowAuth
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              <div className="rounded-xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
                <dt className="text-lg font-semibold leading-8 text-white">
                  How does ShadowAuth ensure privacy?
                </dt>
                <dd className="mt-4 text-base leading-7 text-slate-300">
                  Through ZK-Proof technology, user identity is verified without sharing any sensitive data. 
                  All operations are performed off-chain on the ROFL network.
                </dd>
              </div>
              
              <div className="rounded-xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
                <dt className="text-lg font-semibold leading-8 text-white">
                  How secure are Session Keys?
                </dt>
                <dd className="mt-4 text-base leading-7 text-slate-300">
                  Session Keys are cryptographically secure and temporary. A new key is generated 
                  for each session and automatically expires at the end of the session.
                </dd>
              </div>

              <div className="rounded-xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
                <dt className="text-lg font-semibold leading-8 text-white">
                  Which applications can integrate?
                </dt>
                <dd className="mt-4 text-base leading-7 text-slate-300">
                  Any dApp requiring Web3 authentication can integrate ShadowAuth. 
                  Our SDK supports all popular frameworks.
                </dd>
              </div>

              <div className="rounded-xl bg-slate-900/50 p-8 ring-1 ring-slate-800">
                <dt className="text-lg font-semibold leading-8 text-white">
                  How long does integration take?
                </dt>
                <dd className="mt-4 text-base leading-7 text-slate-300">
                  With our simple SDK, integration takes about 30 minutes on average. 
                  Detailed documentation and example code help speed up the process.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
