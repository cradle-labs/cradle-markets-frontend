/**
 * Custom hook to fetch token balances for multiple assets using Hedera
 */

'use client'

import { Asset } from '@repo/lib/cradle-client-ts/types'
import { useQueries } from '@tanstack/react-query'

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
/**
 * Convert hex token address to Hedera token ID format
 * @param token - Token address in hex format (e.g., "0x00000000000000000000000000000000006d4d0b")
 * @returns Hedera token ID (e.g., "0.0.7163147")
 */
function hexToHederaTokenId(token: string): string {
  const cleanHex = token.toLowerCase().replace('0x', '')
  const tokenNum = parseInt(cleanHex.slice(-8), 16)
  return `0.0.${tokenNum}`
}

/**
 * Convert Hedera contract ID to account ID format
 */
function formatHederaAccountId(address: string | undefined): string | undefined {
  if (!address) return undefined

  if (address.match(/^\d+\.\d+\.\d+$/)) {
    return address
  }

  if (address.startsWith('0x') || address.match(/^[0-9a-fA-F]{40}$/)) {
    const cleanHex = address.toLowerCase().replace('0x', '')
    const accountNum = parseInt(cleanHex.slice(-8), 16)
    return `0.0.${accountNum}`
  }

  return undefined
}

/**
 * Format number with commas and 2 decimal places
 */
function formatNumberWithCommas(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Fetch Hedera token balance from Mirror Node API
 */
async function fetchHederaBalance(
  accountId: string,
  tokenId: string
): Promise<{ balance: string; formatted: string; decimals: number } | null> {
  try {
    const hederaAccountId = formatHederaAccountId(accountId)
    const hederaTokenId = hexToHederaTokenId(tokenId)

    if (!hederaAccountId || !hederaTokenId) {
      return null
    }

    const response = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/accounts/${hederaAccountId}/tokens?token.id=${hederaTokenId}`
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.tokens || data.tokens.length === 0) {
      return {
        balance: '0',
        formatted: '0.00',
        decimals: 8,
      }
    }

    const tokenData = data.tokens[0]
    const balance = tokenData.balance || '0'
    const decimals = tokenData.decimals || 8

    const balanceNumber = parseInt(balance) / Math.pow(10, decimals)
    const formatted = formatNumberWithCommas(balanceNumber)

    return {
      balance,
      formatted,
      decimals,
    }
  } catch {
    return null
  }
}

export function useTokenBalances({
  walletContractId,
  assets,
  enabled = true,
}: UseTokenBalancesParams) {
  // Create stable queries for all assets
  const queries = (assets || []).map(asset => ({
    queryKey: ['hedera-balance', walletContractId, asset.token],
    queryFn: () => {
      if (!walletContractId || !asset.token) {
        throw new Error('Wallet contract ID and token are required')
      }
      return fetchHederaBalance(walletContractId, asset.token)
    },
    enabled: enabled && !!walletContractId && !!asset.token,
    staleTime: 30000,
    refetchInterval: 30000,
    retry: 2,
  }))

  // Use useQueries to fetch all balances
  const results = useQueries({ queries })

  // Process results into the expected format
  const balances: Record<string, TokenBalance> = {}
  let hasAnyLoading = false
  let hasAnyError = false

  results.forEach((result, index) => {
    const asset = assets?.[index]
    if (!asset) return

    const { data, isLoading, error } = result

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
