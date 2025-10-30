/**
 * Custom hook to fetch token balances for multiple assets using wagmi
 */

'use client'

import { useBalance } from '@repo/lib/shared/utils/wagmi'
import type { Asset } from '@repo/lib/cradle-client-ts/cradle-api-client'

interface UseTokenBalancesParams {
  walletAddress: string | undefined
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
 * Uses wagmi's useBalance hook for each asset
 *
 * @example
 * ```tsx
 * const { balances, isLoading } = useTokenBalances({
 *   walletAddress: '0x123...',
 *   assets: assetsData,
 * })
 * ```
 */
export function useTokenBalances({
  walletAddress,
  assets,
  enabled = true,
}: UseTokenBalancesParams) {
  const balances: Record<string, TokenBalance> = {}
  let hasAnyLoading = false
  let hasAnyError = false

  // Fetch balance for each asset
  assets?.forEach(asset => {
    const shouldFetch = enabled && !!walletAddress && !!asset.token

    // Format the token address to ensure it has 0x prefix
    const formattedTokenAddress = asset.token.toLowerCase().startsWith('0x')
      ? (asset.token as `0x${string}`)
      : (`0x${asset.token}` as `0x${string}`)

    // Use wagmi's useBalance hook
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, error } = useBalance({
      address: walletAddress as `0x${string}`,
      token: formattedTokenAddress,
      query: {
        enabled: shouldFetch,
        // Refetch every 30 seconds
        refetchInterval: 30000,
        // Keep previous data while refetching
        placeholderData: previousData => previousData,
      },
    })

    if (isLoading) hasAnyLoading = true
    if (error) hasAnyError = true

    balances[asset.id] = {
      assetId: asset.id,
      token: asset.token,
      symbol: asset.symbol,
      balance: data?.value.toString() || '0',
      decimals: data?.decimals || asset.decimals,
      formatted: data?.formatted || '0',
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
