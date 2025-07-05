'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { WorldIDLogin } from "@/components/world-id-login"
import { toast } from "sonner"
import { ShieldModel } from "./shield-model"
import Image from "next/image"

export function HeroSection() {
  const [sessionKey, setSessionKey] = useState<string | null>(null)
  const [isTestingSession, setIsTestingSession] = useState(false)

  const handleLoginSuccess = (key: string) => {
    setSessionKey(key)
    toast.success("Login successful!")
  }

  const testSession = async () => {
    if (!sessionKey) return
    
    setIsTestingSession(true)
    try {
      // ROFL test işlemi burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simüle edilmiş test
      toast.success("ROFL test successful!")
    } catch (error) {
      toast.error("ROFL test failed!")
    } finally {
      setIsTestingSession(false)
    }
  }

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative isolate pt-14">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-float mb-8 relative w-[200px] h-[200px] mx-auto">
            <Image
              src="/shield.svg"
              alt="ShadowAuth Shield"
              fill
              className="object-contain animate-glow"
              priority
              sizes="200px"
            />
            <div className="absolute inset-0 blur-3xl bg-indigo-500/30 -z-10"></div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gradient sm:text-6xl">
            Privacy-Focused Authentication
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Protect your users' privacy with ShadowAuth. Secure and anonymous authentication 
            with World ID, ZK-Proof and ROFL technologies.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-x-6">
              <WorldIDLogin onSuccess={handleLoginSuccess} />
              <Button
                variant="ghost"
                onClick={scrollToHowItWorks}
                className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors border-glow"
              >
                How It Works? <span aria-hidden="true">→</span>
              </Button>
            </div>

            {sessionKey && (
              <div className="glass-effect border-glow p-4 rounded-lg w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">
                    <Icons.checkCircle className="mr-1 h-3 w-3" />
                    Session Active
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {sessionKey.substring(0, 8)}...{sessionKey.substring(sessionKey.length - 4)}
                  </span>
                </div>
                
                <Button 
                  onClick={testSession}
                  disabled={isTestingSession}
                  className="w-full bg-indigo-600 hover:bg-indigo-500"
                >
                  {isTestingSession ? (
                    <>
                      <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Icons.shield className="mr-2 h-4 w-4" />
                      Test ROFL
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dekoratif Arka Plan */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Nasıl Çalışır? */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        {/* ... existing code ... */}
      </section>
    </div>
  )
} 