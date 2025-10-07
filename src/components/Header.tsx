"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  Grid3X3,
  Camera,
  Trophy,
  ChevronDown,
  Wallet,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 trading-bg border-b border-trading-border">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-8">
          {/* Left - Branding */}
          <Link href="/trade" className="flex items-end">
            <h1 className="text-xl font-bold text-white tracking-wider font-audiowide">
              CRADLE
            </h1>
          </Link>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/trade"
              className={`text-sm font-medium transition-colors tracking-wide font-dm-sans ${
                pathname.startsWith("/trade")
                  ? "text-white font-bold"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Trade
            </Link>
            <Link
              href="/perps"
              className={`text-sm font-medium transition-colors tracking-wide font-dm-sans ${
                pathname.startsWith("/perps")
                  ? "text-white font-bold"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Perps
            </Link>
            <Link
              href="/lend"
              className={`text-sm font-medium transition-colors tracking-wide font-dm-sans ${
                pathname.startsWith("/lend")
                  ? "text-white font-bold"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Lend
            </Link>
            <Link
              href="/portfolio"
              className={`text-sm font-medium transition-colors tracking-wide font-dm-sans ${
                pathname.startsWith("/portfolio")
                  ? "text-white font-bold"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="/more"
              className={`text-sm font-medium transition-colors tracking-wide font-dm-sans ${
                pathname.startsWith("/more")
                  ? "text-white font-bold"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              More
            </Link>
          </nav>
        </div>

        {/* Right - Utility Section */}
        <div className="flex items-center space-x-4 ">
          {/* Icon Buttons */}
          <div className="hidden md:flex items-center space-x-2 border border-border rounded-lg p-2 bg-surface">
            <button className="w-4 h-4 rounded-full trading-card border border-trading-border flex items-center justify-center hover:bg-surface-hover transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-border"></div>

            <button className="w-4 h-4 rounded-full trading-card border border-trading-border flex items-center justify-center hover:bg-surface-hover transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Icon Buttons - Mobile (separate) */}
          <div className="flex md:hidden items-center space-x-2">
            <button className="w-8 h-8 rounded-full trading-card border border-trading-border flex items-center justify-center hover:bg-surface-hover transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full trading-card border border-trading-border flex items-center justify-center hover:bg-surface-hover transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full trading-card border border-trading-border flex items-center justify-center hover:bg-surface-hover transition-colors">
              <Wallet className="w-4 h-4" />
            </button>
          </div>

          {/* Wallet Address - Desktop */}
          <div className="hidden md:flex items-center space-x-2 border border-border rounded-lg py-1.5 px-2 bg-surface hover:bg-surface-hover transition-colors cursor-pointer">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-mono text-white">connect wallet</span>
          </div>
        </div>
      </div>
    </header>
  );
}
