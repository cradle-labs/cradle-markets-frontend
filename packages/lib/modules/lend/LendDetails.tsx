'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { useQueries } from '@tanstack/react-query'
import { LendingPoolTable, LendingPoolData } from './LendingPoolTable'
import { useLendingPools, useAssets } from '@repo/lib/cradle-client-ts/hooks'
import { cradleQueryKeys } from '@repo/lib/cradle-client-ts/queryKeys'
import { fetchPoolStats } from '@repo/lib/cradle-client-ts/services/fetchers'
import { standardQueryOptions } from '@repo/lib/cradle-client-ts/utils/query-options'
import { fromBasisPoints, fromTokenDecimals } from './utils'

export function LendDetails() {
  const router = useRouter()
  const { data: lendingPools, isLoading: isLoadingLendingPools } = useLendingPools()
  console.log('lendingPools', lendingPools)
  const { data: assets, isLoading: isLoadingAssets } = useAssets()
  console.log('assets', assets)

  // Fetch stats for all pools
  const snapshotQueries = useQueries({
    queries: (lendingPools || []).map(pool => ({
      queryKey: [...cradleQueryKeys.lendingPools.byId(pool.id), 'stats'],
      queryFn: () => fetchPoolStats(pool.id),
      enabled: !!pool.id,
      ...standardQueryOptions,
    })),
  })

  // Check if any snapshot is still loading
  const isLoadingSnapshots = snapshotQueries.some(query => query.isLoading)
  console.log(
    'snapshots',
    snapshotQueries.map(q => q.data)
  )

  // Enrich lending pool data with asset info and snapshot values
  const enrichedPools: LendingPoolData[] = useMemo(() => {
    if (!lendingPools || !assets) return []

    return lendingPools.map((pool, index) => {
      const asset = assets.find(a => a.id === pool.reserve_asset)
      const snapshot = snapshotQueries[index]?.data

      // Get metrics from snapshot or use defaults
      // Convert token amounts from decimals (8 decimals) to normalized form
      const totalSupplied =
        snapshot &&
        typeof snapshot === 'object' &&
        'total_supply' in snapshot &&
        typeof snapshot.total_supply === 'string'
          ? fromTokenDecimals(parseFloat(snapshot.total_supply))
          : 0
      const totalBorrowed =
        snapshot &&
        typeof snapshot === 'object' &&
        'total_borrow' in snapshot &&
        typeof snapshot.total_borrow === 'string'
          ? fromTokenDecimals(parseFloat(snapshot.total_borrow))
          : 0

      // Convert utilization and APYs from basis points to decimal
      const utilization =
        snapshot &&
        typeof snapshot === 'object' &&
        'utilization_rate' in snapshot &&
        typeof snapshot.utilization_rate === 'string'
          ? fromBasisPoints(snapshot.utilization_rate)
          : 0
      const supplyAPY =
        snapshot &&
        typeof snapshot === 'object' &&
        'supply_apy' in snapshot &&
        typeof snapshot.supply_apy === 'string'
          ? fromBasisPoints(snapshot.supply_apy)
          : 0
      const borrowAPY =
        snapshot &&
        typeof snapshot === 'object' &&
        'borrow_apy' in snapshot &&
        typeof snapshot.borrow_apy === 'string'
          ? fromBasisPoints(snapshot.borrow_apy)
          : 0

      return {
        ...pool,
        asset,
        totalSupplied,
        totalBorrowed,
        utilization,
        supplyAPY,
        borrowAPY,
      }
    })
  }, [lendingPools, assets, snapshotQueries])

  const handlePoolClick = (pool: LendingPoolData) => {
    router.push(`/lend/${pool.id}`)
  }

  const isLoading = isLoadingLendingPools || isLoadingAssets || isLoadingSnapshots

  return (
    <Box w="full">
      <LendingPoolTable loading={isLoading} onPoolClick={handlePoolClick} pools={enrichedPools} />
    </Box>
  )
}
