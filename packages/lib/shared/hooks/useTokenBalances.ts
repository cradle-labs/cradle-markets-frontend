/**
 * Custom hook to fetch token balances for multiple assets using Hedera
 */

'use client'

import { useHederaBalance } from './useHederaBalance'
import type { Asset } from '@repo/lib/cradle-client-ts/cradle-api-client'

interface UseTokenBalancesParams {
  walletContractId: string | undefined // Hedera contract ID (e.g., "0.0.7163140")
  assets: Asset[] | undefined
  enabled?: boolean
}

interface TokenBalance {
  assetId: string
  token: string
  symbol: string
  balance: string
  decimals: number
  formatted: string
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to fetch balances for multiple token assets
 * Uses Hedera Mirror Node API for each asset
 *
 * @example
 * ```tsx
 * const { balances, isLoading } = useTokenBalances({
 *   walletContractId: wallet.contract_id, // "0.0.7163140"
 *   assets: assetsData,
 * })
 * ```
 */
export function useTokenBalances({
  walletContractId,
  assets,
  enabled = true,
}: UseTokenBalancesParams) {
  const balances: Record<string, TokenBalance> = {}
  let hasAnyLoading = false
  let hasAnyError = false

  // Fetch balance for each asset
  assets?.forEach(asset => {
    const shouldFetch = enabled && !!walletContractId && !!asset.token

    // Use Hedera balance hook
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, error } = useHederaBalance({
      accountId: walletContractId,
      tokenId: asset.token,
      enabled: shouldFetch,
    })

    if (isLoading) hasAnyLoading = true
    if (error) hasAnyError = true

    balances[asset.id] = {
      assetId: asset.id,
      token: asset.token,
      symbol: asset.symbol,
      balance: data?.balance || '0',
      decimals: data?.decimals || asset.decimals,
      formatted: data?.formatted || '0.00',
      isLoading,
      error: error as Error | null,
    }
  })

  return {
    balances,
    isLoading: hasAnyLoading,
    hasError: hasAnyError,
  }
}
