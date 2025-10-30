/**
 * Cradle API Client Hooks
 *
 * TanStack Query hooks for interacting with the Cradle API.
 * All hooks are client-side only and use server actions to fetch data.
 *
 * @example
 * ```tsx
 * import { useAccount, useMarkets, useOrders } from '@repo/lib/cradle-client-ts/hooks'
 *
 * function MyComponent() {
 *   const { data: account } = useAccountByLinkedId({ linkedAccountId: userId })
 *   const { data: markets } = useMarkets({ filters: { status: 'active' } })
 *   const { data: orders } = useOrders({ filters: { wallet: walletId } })
 *
 *   return <div>...</div>
 * }
 * ```
 */

// Account hooks
export * from './accounts'

// Asset hooks
export * from './assets'

// Market hooks
export * from './markets'

// Order hooks
export * from './orders'

// Lending hooks
export * from './lending'

// Time series hooks
export * from './time-series'
