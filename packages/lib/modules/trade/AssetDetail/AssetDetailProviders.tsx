'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { FiatFxRatesProvider } from '@repo/lib/shared/hooks/FxRatesProvider'
import { FxRates } from '@repo/lib/shared/utils/currencies'

// Mock tokens for the asset detail page
// These tokens are available for use in the asset detail pages
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockTokens = [
  {
    address: '0xA0b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: '/images/tokens/usdc.svg',
    chainId: 1,
  },
  {
    address: '0xB1b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B',
    symbol: 'NVDAon',
    name: 'NVIDIA Tokenized',
    decimals: 18,
    logoURI: '/images/tokens/nvidia.svg',
    chainId: 1,
  },
  {
    address: '0xC1b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B',
    symbol: 'AMDon',
    name: 'AMD Tokenized',
    decimals: 18,
    logoURI: '/images/tokens/amd.svg',
    chainId: 1,
  },
  {
    address: '0xD1b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B',
    symbol: 'SLVon',
    name: 'iShares Silver Trust Tokenized',
    decimals: 18,
    logoURI: '/images/tokens/silver.svg',
    chainId: 1,
  },
]

export function AssetDetailProviders({ children }: PropsWithChildren) {
  const [fxRates, setFxRates] = useState<FxRates | undefined>(undefined)

  useEffect(() => {
    async function fetchFxRates() {
      try {
        const response = await fetch('/api/fx-rates')
        if (response.ok) {
          const data = await response.json()
          setFxRates(data)
        }
      } catch (error) {
        console.error('Failed to fetch FX rates:', error)
      }
    }

    fetchFxRates()
  }, [])

  return (
    <FiatFxRatesProvider data={fxRates}>
      {children}
    </FiatFxRatesProvider>
  )
}
