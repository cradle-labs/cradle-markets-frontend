'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'

interface AssetDetailContextType {
  asset: TokenizedAssetData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const AssetDetailContext = createContext<AssetDetailContextType | undefined>(undefined)

interface AssetDetailProviderProps {
  children: ReactNode
  assetId: string
}

// Mock data - in a real app this would come from an API
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
      [1696320000, 25.20], // Oct 3
      [1696406400, 25.45], // Oct 4
      [1696492800, 25.10], // Oct 5
      [1696579200, 25.80], // Oct 6
      [1696665600, 26.00], // Oct 7
      [1696752000, 25.65], // Oct 8
      [1696838400, 26.15], // Oct 9
      [1696924800, 26.30], // Oct 10
      [1697011200, 26.45], // Oct 11
      [1697097600, 26.20], // Oct 12
      [1697184000, 25.75], // Oct 13
      [1697270400, 26.50], // Oct 14
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
      [1696320000, 54.00],
      [1696406400, 54.50],
      [1696492800, 53.75],
      [1696579200, 53.25],
      [1696665600, 54.10],
      [1696752000, 53.50],
      [1696838400, 54.25],
      [1696924800, 53.80],
      [1697011200, 54.35],
      [1697097600, 54.00],
      [1697184000, 53.50],
      [1697270400, 52.75],
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
      [1696320000, 36.50],
      [1696406400, 36.85],
      [1696492800, 36.20],
      [1696579200, 37.00],
      [1696665600, 37.45],
      [1696752000, 36.90],
      [1696838400, 37.75],
      [1696924800, 38.25],
    ],
  },
]

export function AssetDetailProvider({ children, assetId }: AssetDetailProviderProps) {
  const [asset, setAsset] = useState<TokenizedAssetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAsset = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundAsset = mockAssets.find(a => a.id === assetId)
      if (foundAsset) {
        setAsset(foundAsset)
      } else {
        setError(`Asset with ID "${assetId}" not found`)
      }
    } catch (err) {
      setError('Failed to load asset details')
      console.error('Error fetching asset:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAsset()
  }, [assetId])

  const refetch = () => {
    fetchAsset()
  }

  const value: AssetDetailContextType = {
    asset,
    loading,
    error,
    refetch,
  }

  return (
    <AssetDetailContext.Provider value={value}>
      {children}
    </AssetDetailContext.Provider>
  )
}

export function useAssetDetail(): AssetDetailContextType {
  const context = useContext(AssetDetailContext)
  if (context === undefined) {
    throw new Error('useAssetDetail must be used within an AssetDetailProvider')
  }
  return context
}
