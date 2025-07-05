"use client"

import { Icons } from "./icons"

export function Footer() {
  return (
    <footer className="glass-effect border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            href="https://instagram.com/odtublockchain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-300 hover-scale"
          >
            <span className="sr-only">Instagram</span>
            <Icons.instagram className="h-6 w-6" />
          </a>
          <a
            href="https://x.com/odtublockchain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-300 hover-scale"
          >
            <span className="sr-only">X (Twitter)</span>
            <Icons.x className="h-6 w-6" />
          </a>
          <a
            href="https://bdays.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-300 hover-scale"
          >
            <span className="sr-only">Website</span>
            <Icons.website className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} ShadowAuth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 