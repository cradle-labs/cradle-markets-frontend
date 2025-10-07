"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Github, Settings } from "lucide-react";
import { motion } from "framer-motion";

const nseStocks = [
  { symbol: "SCOM", name: "Safaricom", price: 28.50, change: 2.3 },
  { symbol: "EQTY", name: "Equity Bank", price: 52.75, change: -1.2 },
  { symbol: "KCB", name: "KCB Group", price: 45.00, change: 1.8 },
  { symbol: "EABL", name: "E.A. Breweries", price: 185.50, change: 0.5 },
  { symbol: "BAT", name: "BAT Kenya", price: 425.00, change: -0.8 },
  { symbol: "BAMB", name: "Bamburi Cement", price: 35.25, change: 1.5 },
  { symbol: "KQ", name: "Kenya Airways", price: 3.45, change: -2.1 },
  { symbol: "COOP", name: "Co-op Bank", price: 13.85, change: 0.7 },
  { symbol: "SCBK", name: "Stanchart", price: 148.00, change: 1.2 },
  { symbol: "NMG", name: "Nation Media", price: 18.50, change: -1.5 },
  { symbol: "KPLC", name: "Kenya Power", price: 2.15, change: 3.8 },
  { symbol: "BRIT", name: "Britam", price: 6.80, change: 0.9 },
  { symbol: "JBIC", name: "Jubilee Ins.", price: 250.00, change: -0.3 },
  { symbol: "I&M", name: "I&M Holdings", price: 22.50, change: 1.1 },
  { symbol: "CTUM", name: "Centum", price: 15.75, change: -1.8 },
];

export default function Footer() {
  const pathname = usePathname();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-trading-border">
      {/* Mobile Navigation - visible on small screens */}
      <div className="md:hidden flex items-center justify-around h-12 px-4">
        <Link
          href="/trade"
          className={`flex items-center justify-center flex-1 text-sm font-medium transition-colors font-dm-sans tracking-wide h-full ${
            pathname.startsWith("/trade")
              ? "text-white font-bold border-t-2 border-t-white"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Trade
        </Link>
        <Link
          href="/perps"
          className={`flex items-center justify-center flex-1 text-sm font-medium transition-colors font-dm-sans tracking-wide h-full ${
            pathname.startsWith("/perps")
              ? "text-white font-bold border-t-2 border-t-white"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Perps
        </Link>
        <Link
          href="/lend"
          className={`flex items-center justify-center flex-1 text-sm font-medium transition-colors font-dm-sans tracking-wide h-full ${
            pathname.startsWith("/lend")
              ? "text-white font-bold border-t-2 border-t-white"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Lend
        </Link>
        <Link
          href="/portfolio"
          className={`flex items-center justify-center flex-1 text-sm font-medium transition-colors font-dm-sans tracking-wide h-full ${
            pathname.startsWith("/portfolio")
              ? "text-white font-bold border-t-2 border-t-white"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Portfolio
        </Link>
        <Link
          href="/more"
          className={`flex items-center justify-center flex-1 text-sm font-medium transition-colors font-dm-sans tracking-wide h-full ${
            pathname.startsWith("/more")
              ? "text-white font-bold border-t-2 border-t-white"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          More
        </Link>
      </div>

      {/* Desktop Footer - hidden on small screens */}
      <div className="hidden md:flex items-center justify-between h-12 px-6">
        {/* Left Section - Audit Info */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <span className="text-xs text-muted-foreground">Audited by</span>
          <div className="flex items-center space-x-2">
            {/* Mock audit firm logos */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center"
              >
                <div className="w-3 h-3 rounded-full bg-surface-hover"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Section - NSE Stock Ticker */}
        <div className="flex-1 overflow-hidden mx-8">
          <div className="relative">
            <motion.div
              className="flex space-x-6"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {/* Render stocks twice for seamless loop */}
              {[...nseStocks, ...nseStocks].map((stock, index) => (
                <div
                  key={`${stock.symbol}-${index}`}
                  className="flex items-center space-x-2 text-xs font-mono whitespace-nowrap"
                >
                  <span className="text-white font-semibold">{stock.symbol}</span>
                  <span className="text-muted-foreground">KES {stock.price.toFixed(2)}</span>
                  <span
                    className={
                      stock.change >= 0
                        ? "trading-green"
                        : "text-red-500"
                    }
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(1)}%
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Section - Social */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-surface-hover transition-colors">
            <MessageCircle className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-surface-hover transition-colors">
            <Github className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 rounded-full trading-card border border-border flex items-center justify-center hover:bg-surface-hover transition-colors">
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
