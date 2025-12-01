/**
 * useAccountWallet Hook
 *
 * TanStack Query hook for fetching the first wallet for an account
 * This is a convenience hook that wraps useAccountWallets and returns the first wallet
 */

'use client'

import { useMemo } from 'react'
import { useAccountWallets } from './useAccountWallets'

export interface UseAccountWalletOptions {
  /**
   * Account ID to fetch wallet for
   */
  accountId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
}

/**
 * Hook to fetch the first wallet for a Cradle account
 *
 * @example
 * ```tsx
 * function AccountWallet({ accountId }: { accountId: string }) {
 *   const { data: wallet, isLoading } = useAccountWallet({ accountId })
 *
 *   if (isLoading) return <Spinner />
 *   if (!wallet) return <div>No wallet found</div>
 *
 *   return <div>{wallet.address}</div>
 * }
 * ```
 */
export function useAccountWallet({ accountId, enabled = true }: UseAccountWalletOptions) {
  const {
    data: wallets,
    isLoading,
    error,
    ...rest
  } = useAccountWallets({
    accountId,
    enabled,
  })

  // Get the first wallet from the array
  const wallet = useMemo(() => {
    return wallets && wallets.length > 0 ? wallets[0] : null
  }, [wallets])

  return {
    data: wallet,
    isLoading,
    error,
    ...rest,
  }
}
