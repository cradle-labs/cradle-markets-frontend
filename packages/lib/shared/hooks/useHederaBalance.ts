/**
 * Custom hook to fetch Hedera token balances using Mirror Node API
 */

'use client'

import { useQuery } from '@tanstack/react-query'

interface HederaBalanceParams {
  accountId: string | undefined // e.g., "0.0.7163140"
  tokenId: string | undefined // e.g., "0.0.7163146" or hex format
  enabled?: boolean
}

interface HederaBalanceResponse {
  balance: string
  decimals: number
  token_id: string
}

/**
 * Convert hex token address to Hedera token ID format
 * @param token - Token address in hex format (e.g., "0x00000000000000000000000000000000006d4d0b")
 * @returns Hedera token ID (e.g., "0.0.7163147")
 */
function hexToHederaTokenId(token: string): string {
  // Remove 0x prefix if present
  const cleanHex = token.toLowerCase().replace('0x', '')

  // Convert last 8 characters (4 bytes) from hex to decimal
  const tokenNum = parseInt(cleanHex.slice(-8), 16)

  // Return in Hedera format
  return `0.0.${tokenNum}`
}

/**
 * Convert Hedera contract ID to account ID format
 * Contract IDs like "0.0.7163140" can be used directly as account IDs
 * But wallet addresses in hex need to be converted
 */
function formatHederaAccountId(address: string | undefined): string | undefined {
  if (!address) return undefined

  // If already in Hedera format (0.0.XXXXX), return as is
  if (address.match(/^\d+\.\d+\.\d+$/)) {
    return address
  }

  // If hex format, convert to Hedera format
  if (address.startsWith('0x') || address.match(/^[0-9a-fA-F]{40}$/)) {
    const cleanHex = address.toLowerCase().replace('0x', '')
    const accountNum = parseInt(cleanHex.slice(-8), 16)
    return `0.0.${accountNum}`
  }

  return undefined
}

/**
 * Format number with commas and 2 decimal places
 * @param value - Number to format
 * @returns Formatted string (e.g., "1,234.56")
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
        decimals: 8, // Default Hedera decimals
      }
    }

    const tokenData: HederaBalanceResponse = data.tokens[0]
    const balance = tokenData.balance || '0'
    const decimals = tokenData.decimals || 8

    // Convert from smallest unit to regular number
    const balanceNumber = parseInt(balance) / Math.pow(10, decimals)

    // Format with commas and 2 decimal places
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

/**
 * Hook to fetch Hedera token balance
 *
 * @example
 * ```tsx
 * const { data: balance } = useHederaBalance({
 *   accountId: wallet.contract_id, // "0.0.7163140"
 *   tokenId: asset.token, // "0x00000000000000000000000000000000006d4d0b"
 *   enabled: !!wallet && !!asset,
 * })
 *
 * console.log(balance?.formatted) // "100.5"
 * ```
 */
export function useHederaBalance({ accountId, tokenId, enabled = true }: HederaBalanceParams) {
  return useQuery({
    queryKey: ['hedera-balance', accountId, tokenId],
    queryFn: () => {
      if (!accountId || !tokenId) {
        throw new Error('Account ID and Token ID are required')
      }
      return fetchHederaBalance(accountId, tokenId)
    },
    enabled: enabled && !!accountId && !!tokenId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  })
}
