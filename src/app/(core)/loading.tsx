"use client"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="relative w-24 h-24">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-trading-border"></div>
            
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-trading-cyan border-r-trading-green animate-spin"></div>
            
            {/* Inner pulse */}
            <div className="absolute inset-4 rounded-full bg-trading-cyan/10 animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-white font-dm-sans">
          Loading
        </h2>
        
        <p className="text-muted-foreground font-dm-sans">
          Please wait while we prepare your trading dashboard...
        </p>

        {/* Optional: Loading dots animation */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-trading-cyan animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-trading-green animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-trading-yellow animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}

