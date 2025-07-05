"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed top-0 w-full border-b border-slate-800 bg-slate-950/75 backdrop-blur-lg supports-[backdrop-filter]:bg-slate-950/75 z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-16">
        <Link 
          href="/" 
          className="flex items-center transition-colors hover:text-slate-100 text-slate-200"
        >
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-xl md:text-2xl tracking-tight">
            ShadowAuth
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/docs" 
            className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-100"
          >
            Documentation
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={scrollToHowItWorks}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-slate-950 border-slate-800 p-0">
              <div className="flex flex-col gap-4 p-6">
                <Link 
                  href="/docs" 
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-slate-100"
                  onClick={() => setIsOpen(false)}
                >
                  Documentation
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
} 