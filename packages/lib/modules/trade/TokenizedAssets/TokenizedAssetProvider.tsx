'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { TokenizedAssetData } from './TokenizedAssetCard'

interface TokenizedAssetContextType {
  assets: TokenizedAssetData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const TokenizedAssetContext = createContext<TokenizedAssetContextType | undefined>(undefined)

interface TokenizedAssetProviderProps {
  children: ReactNode
}

// Mock data for tokenized assets - in a real app this would come from an API
// Using Nairobi Securities Exchange (NSE) stocks
const mockAssets: TokenizedAssetData[] = [
  {
    id: 'safaricom',
    symbol: 'cSAF',
    name: 'Safaricom',
    logo: '/images/tokens/safaricom.svg',
    currentPrice: 26.50,
    dailyChange: 0.75,
    dailyChangePercent: 2.91,
    priceHistory: [
      [Date.now() - 86400000, 25.20],
      [Date.now() - 82800000, 25.45],
      [Date.now() - 79200000, 25.10],
      [Date.now() - 75600000, 25.80],
      [Date.now() - 72000000, 26.00],
      [Date.now() - 68400000, 25.65],
      [Date.now() - 64800000, 26.15],
      [Date.now() - 61200000, 26.30],
      [Date.now() - 57600000, 26.45],
      [Date.now() - 54000000, 26.20],
      [Date.now() - 50400000, 25.75],
      [Date.now() - 46800000, 26.50],
    ],
  },
  {
    id: 'equity',
    symbol: 'cEQTY',
    name: 'Equity Bank',
    logo: '/images/tokens/equity.svg',
    currentPrice: 52.75,
    dailyChange: -1.25,
    dailyChangePercent: -2.31,
    priceHistory: [
      [Date.now() - 86400000, 54.00],
      [Date.now() - 82800000, 54.50],
      [Date.now() - 79200000, 53.75],
      [Date.now() - 75600000, 53.25],
      [Date.now() - 72000000, 54.10],
      [Date.now() - 68400000, 53.50],
      [Date.now() - 64800000, 54.25],
      [Date.now() - 61200000, 53.80],
      [Date.now() - 57600000, 54.35],
      [Date.now() - 54000000, 54.00],
      [Date.now() - 50400000, 53.50],
      [Date.now() - 46800000, 52.75],
    ],
  },
  {
    id: 'kcb',
    symbol: 'cKCB',
    name: 'KCB Group',
    logo: '/images/tokens/kcb.svg',
    currentPrice: 38.25,
    dailyChange: 1.50,
    dailyChangePercent: 4.08,
    priceHistory: [
      [Date.now() - 86400000, 36.50],
      [Date.now() - 82800000, 36.85],
      [Date.now() - 79200000, 36.20],
      [Date.now() - 75600000, 37.00],
      [Date.now() - 72000000, 37.45],
      [Date.now() - 68400000, 36.90],
      [Date.now() - 64800000, 37.75],
      [Date.now() - 61200000, 38.25],
      [Date.now() - 57600000, 37.90],
      [Date.now() - 54000000, 38.10],
      [Date.now() - 50400000, 37.80],
      [Date.now() - 46800000, 38.25],
    ],
  },
  {
    id: 'eabl',
    symbol: 'cEABL',
    name: 'EABL',
    logo: '/images/tokens/eabl.svg',
    currentPrice: 210.50,
    dailyChange: 3.50,
    dailyChangePercent: 1.69,
    priceHistory: [
      [Date.now() - 86400000, 207.00],
      [Date.now() - 82800000, 206.50],
      [Date.now() - 79200000, 208.00],
      [Date.now() - 75600000, 207.75],
      [Date.now() - 72000000, 209.00],
      [Date.now() - 68400000, 208.50],
      [Date.now() - 64800000, 209.75],
      [Date.now() - 61200000, 210.00],
      [Date.now() - 57600000, 209.50],
      [Date.now() - 54000000, 210.25],
      [Date.now() - 50400000, 209.75],
      [Date.now() - 46800000, 210.50],
    ],
  },
  {
    id: 'coop',
    symbol: 'cCOOP',
    name: 'Co-operative Bank',
    logo: '/images/tokens/coop.svg',
    currentPrice: 16.45,
    dailyChange: -0.15,
    dailyChangePercent: -0.90,
    priceHistory: [
      [Date.now() - 86400000, 16.60],
      [Date.now() - 82800000, 16.75],
      [Date.now() - 79200000, 16.55],
      [Date.now() - 75600000, 16.40],
      [Date.now() - 72000000, 16.50],
      [Date.now() - 68400000, 16.35],
      [Date.now() - 64800000, 16.55],
      [Date.now() - 61200000, 16.40],
      [Date.now() - 57600000, 16.50],
      [Date.now() - 54000000, 16.45],
      [Date.now() - 50400000, 16.55],
      [Date.now() - 46800000, 16.45],
    ],
  },
  {
    id: 'bat',
    symbol: 'cBAT',
    name: 'BAT Kenya',
    logo: '/images/tokens/bat.svg',
    currentPrice: 485.00,
    dailyChange: 10.00,
    dailyChangePercent: 2.11,
    priceHistory: [
      [Date.now() - 86400000, 475.00],
      [Date.now() - 82800000, 472.50],
      [Date.now() - 79200000, 478.00],
      [Date.now() - 75600000, 480.00],
      [Date.now() - 72000000, 477.50],
      [Date.now() - 68400000, 479.00],
      [Date.now() - 64800000, 482.00],
      [Date.now() - 61200000, 481.50],
      [Date.now() - 57600000, 483.00],
      [Date.now() - 54000000, 484.00],
      [Date.now() - 50400000, 482.50],
      [Date.now() - 46800000, 485.00],
    ],
  },
  {
    id: 'bamburi',
    symbol: 'cBMB',
    name: 'Bamburi Cement',
    logo: '/images/tokens/bamburi.svg',
    currentPrice: 58.25,
    dailyChange: 0.75,
    dailyChangePercent: 1.30,
    priceHistory: [
      [Date.now() - 86400000, 57.50],
      [Date.now() - 82800000, 57.75],
      [Date.now() - 79200000, 57.25],
      [Date.now() - 75600000, 57.90],
      [Date.now() - 72000000, 58.10],
      [Date.now() - 68400000, 57.80],
      [Date.now() - 64800000, 58.00],
      [Date.now() - 61200000, 57.70],
      [Date.now() - 57600000, 58.15],
      [Date.now() - 54000000, 58.30],
      [Date.now() - 50400000, 58.00],
      [Date.now() - 46800000, 58.25],
    ],
  },
  {
    id: 'ncba',
    symbol: 'cNCBA',
    name: 'NCBA Group',
    logo: '/images/tokens/ncba.svg',
    currentPrice: 45.50,
    dailyChange: -1.00,
    dailyChangePercent: -2.15,
    priceHistory: [
      [Date.now() - 86400000, 46.50],
      [Date.now() - 82800000, 46.75],
      [Date.now() - 79200000, 46.25],
      [Date.now() - 75600000, 46.00],
      [Date.now() - 72000000, 46.40],
      [Date.now() - 68400000, 45.90],
      [Date.now() - 64800000, 46.20],
      [Date.now() - 61200000, 45.80],
      [Date.now() - 57600000, 46.00],
      [Date.now() - 54000000, 45.70],
      [Date.now() - 50400000, 46.10],
      [Date.now() - 46800000, 45.50],
    ],
  },
  {
    id: 'stanbic',
    symbol: 'cSBIC',
    name: 'Stanbic Holdings',
    logo: '/images/tokens/stanbic.svg',
    currentPrice: 125.00,
    dailyChange: 2.50,
    dailyChangePercent: 2.04,
    priceHistory: [
      [Date.now() - 86400000, 122.50],
      [Date.now() - 82800000, 123.00],
      [Date.now() - 79200000, 122.25],
      [Date.now() - 75600000, 123.50],
      [Date.now() - 72000000, 124.00],
      [Date.now() - 68400000, 123.25],
      [Date.now() - 64800000, 124.25],
      [Date.now() - 61200000, 123.75],
      [Date.now() - 57600000, 124.50],
      [Date.now() - 54000000, 124.75],
      [Date.now() - 50400000, 124.25],
      [Date.now() - 46800000, 125.00],
    ],
  },
  {
    id: 'scb',
    symbol: 'cSCB',
    name: 'Standard Chartered Kenya',
    logo: '/images/tokens/scb.svg',
    currentPrice: 168.50,
    dailyChange: -2.50,
    dailyChangePercent: -1.46,
    priceHistory: [
      [Date.now() - 86400000, 171.00],
      [Date.now() - 82800000, 170.50],
      [Date.now() - 79200000, 171.50],
      [Date.now() - 75600000, 170.25],
      [Date.now() - 72000000, 169.75],
      [Date.now() - 68400000, 170.00],
      [Date.now() - 64800000, 169.50],
      [Date.now() - 61200000, 170.25],
      [Date.now() - 57600000, 169.00],
      [Date.now() - 54000000, 169.50],
      [Date.now() - 50400000, 168.75],
      [Date.now() - 46800000, 168.50],
    ],
  },
  {
    id: 'britam',
    symbol: 'cBRIT',
    name: 'Britam',
    logo: '/images/tokens/britam.svg',
    currentPrice: 8.95,
    dailyChange: 0.20,
    dailyChangePercent: 2.29,
    priceHistory: [
      [Date.now() - 86400000, 8.75],
      [Date.now() - 82800000, 8.80],
      [Date.now() - 79200000, 8.70],
      [Date.now() - 75600000, 8.85],
      [Date.now() - 72000000, 8.90],
      [Date.now() - 68400000, 8.75],
      [Date.now() - 64800000, 8.85],
      [Date.now() - 61200000, 8.80],
      [Date.now() - 57600000, 8.90],
      [Date.now() - 54000000, 8.85],
      [Date.now() - 50400000, 8.80],
      [Date.now() - 46800000, 8.95],
    ],
  },
  {
    id: 'absa',
    symbol: 'cABSA',
    name: 'Absa Bank Kenya',
    logo: '/images/tokens/absa.svg',
    currentPrice: 14.80,
    dailyChange: -0.30,
    dailyChangePercent: -1.99,
    priceHistory: [
      [Date.now() - 86400000, 15.10],
      [Date.now() - 82800000, 15.20],
      [Date.now() - 79200000, 14.95],
      [Date.now() - 75600000, 14.85],
      [Date.now() - 72000000, 15.00],
      [Date.now() - 68400000, 14.90],
      [Date.now() - 64800000, 15.05],
      [Date.now() - 61200000, 14.85],
      [Date.now() - 57600000, 14.95],
      [Date.now() - 54000000, 14.80],
      [Date.now() - 50400000, 15.00],
      [Date.now() - 46800000, 14.80],
    ],
  },
]

export function TokenizedAssetProvider({ children }: TokenizedAssetProviderProps) {
  const [assets, setAssets] = useState<TokenizedAssetData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would fetch from an API
      // const response = await fetch('/api/tokenized-assets')
      // const data = await response.json()
      
      setAssets(mockAssets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const refetch = () => {
    fetchAssets()
  }

  return (
    <TokenizedAssetContext.Provider
      value={{
        assets,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </TokenizedAssetContext.Provider>
  )
}

export function useTokenizedAssets() {
  const context = useContext(TokenizedAssetContext)
  if (context === undefined) {
    throw new Error('useTokenizedAssets must be used within a TokenizedAssetProvider')
  }
  return context
}

