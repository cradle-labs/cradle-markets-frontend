"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full trading-card border-2 border-trading-border">
          <FileQuestion className="w-12 h-12 text-muted-foreground" />
        </div>

        <h1 className="text-6xl font-bold mb-4 font-audiowide">
          <span className="trading-cyan">404</span>
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-white font-dm-sans">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mb-8 font-dm-sans">
          The page you're looking for doesn't exist or has been moved. Please
          check the URL or return to the trading dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/trade"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg trading-button-primary transition-all hover:opacity-90 hover:transform hover:translate-y-[-2px] font-dm-sans"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg trading-card border border-border text-white hover:bg-surface-hover transition-colors font-dm-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

