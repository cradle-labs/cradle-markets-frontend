'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { useQueries } from '@tanstack/react-query'
import { LendingPoolTable, LendingPoolData } from './LendingPoolTable'
import { useLendingPools, useAssets } from '@repo/lib/cradle-client-ts/hooks'
import { cradleQueryKeys } from '@repo/lib/cradle-client-ts/queryKeys'
import { fetchPoolSnapshot } from '@repo/lib/cradle-client-ts/services/fetchers'
import { standardQueryOptions } from '@repo/lib/cradle-client-ts/utils/query-options'
import { fromBasisPoints, fromTokenDecimals } from './utils'

export function LendDetails() {
  const router = useRouter()
  const { data: lendingPools, isLoading: isLoadingLendingPools } = useLendingPools()
  console.log('lendingPools', lendingPools)
  const { data: assets, isLoading: isLoadingAssets } = useAssets()
  console.log('assets', assets)

  // Fetch snapshots for all pools
  const snapshotQueries = useQueries({
    queries: (lendingPools || []).map(pool => ({
      queryKey: cradleQueryKeys.lendingPools.snapshot(pool.id),
      queryFn: () => fetchPoolSnapshot(pool.id),
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
      const totalSupplied = snapshot?.total_supply
        ? fromTokenDecimals(parseFloat(snapshot.total_supply))
        : 0
      const totalBorrowed = snapshot?.total_borrow
        ? fromTokenDecimals(parseFloat(snapshot.total_borrow))
        : 0

      // Convert utilization and APYs from basis points to decimal
      const utilization = snapshot?.utilization_rate
        ? fromBasisPoints(snapshot.utilization_rate)
        : 0
      const supplyAPY = snapshot?.supply_apy ? fromBasisPoints(snapshot.supply_apy) : 0
      const borrowAPY = snapshot?.borrow_apy ? fromBasisPoints(snapshot.borrow_apy) : 0

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
