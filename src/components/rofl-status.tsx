'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { isROFLHealthy, getROFLVersion } from '@/lib/rofl'
import { Icons } from '@/components/icons'

export function ROFLStatus() {
  const [isOnline, setIsOnline] = useState(false)
  const [version, setVersion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [healthy, ver] = await Promise.all([
          isROFLHealthy(true), // testnet check
          getROFLVersion(true)
        ])
        
        setIsOnline(healthy)
        setVersion(ver)
      } catch (error) {
        console.error('ROFL status check failed:', error)
        setIsOnline(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        <Icons.loader2 className="h-4 w-4 animate-spin text-indigo-400" />
        <span className="text-xs md:text-sm text-slate-400">Checking ROFL...</span>
      </div>
    )
  }

  return (
    <Card className="glass-effect border-glow hover-scale">
      <div className="flex items-center gap-4 p-4">
        <div className="relative">
          <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'} animate-glow`} />
          <div 
            className={`absolute inset-0 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'} animate-ping`} 
            style={{ animationDuration: '2s' }}
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Icons.server className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-white">ROFL Node</span>
            <Badge variant="secondary" className="text-xs">
              {version}
            </Badge>
          </div>
          
          <span className="text-xs text-slate-400">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </Card>
  )
} 