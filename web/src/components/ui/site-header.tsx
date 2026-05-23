"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ethereal-beams-hero";

interface SiteHeaderProps {
  showLaunchButton?: boolean;
  showConnectButton?: boolean;
  rightContent?: React.ReactNode;
}

export function SiteHeader({
  showLaunchButton = false,
  showConnectButton = true,
  rightContent,
}: SiteHeaderProps) {
  return (
    <nav className="relative z-50 w-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
              Sahyogi
            </span>
          </Link>

          {/* Glassmorphic Pill Navigation */}
          <div className="hidden md:flex items-center space-x-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 p-1">
            <Link href="/faq" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white">
              FAQ
            </Link>
            <Link href="/video" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white">
              Video Call
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {rightContent}

            {showLaunchButton && (
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                Launch App <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {showConnectButton && <ConnectButton />}

            {!showLaunchButton && (
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
