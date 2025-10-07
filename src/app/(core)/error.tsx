"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full trading-card border-2 border-trading-red/30">
          <AlertTriangle className="w-12 h-12 text-trading-red" />
        </div>

        <h1 className="text-4xl font-bold mb-4 font-audiowide">
          <span className="trading-red">Something went wrong!</span>
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-white font-dm-sans">
          An unexpected error occurred
        </h2>

        <p className="text-muted-foreground mb-2 font-dm-sans">
          We apologize for the inconvenience. Our team has been notified and is
          working on a fix.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg trading-button-primary transition-all hover:opacity-90 hover:transform hover:translate-y-[-2px] font-dm-sans"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/trade"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg trading-card border border-border text-white hover:bg-surface-hover transition-colors font-dm-sans"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

