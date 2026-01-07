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
  const { data: assets, isLoading: isLoadingAssets } = useAssets()
  console.log('lendingPools', lendingPools)
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

  // Enrich lending pool data with asset info and snapshot values
  const enrichedPools: LendingPoolData[] = useMemo(() => {
    if (!lendingPools || !assets) return []

    return lendingPools.map((pool, index) => {
      const asset = assets.find(a => a.id === pool.reserve_asset)
      const poolStats = snapshotQueries[index]?.data
      console.log('poolStats', poolStats)

      // Get metrics from poolStats or use defaults
      // Convert token amounts from decimals to normalized form using actual asset decimals
      // Note: poolStats uses 'utilization', 'supply_rate', 'borrow_rate' (not 'utilization_rate', 'supply_apy', 'borrow_apy')
      const assetDecimals = asset?.decimals ?? 8
      const totalSupplied =
        poolStats?.total_supplied != null
          ? fromTokenDecimals(Number(poolStats.total_supplied as string | number), assetDecimals)
          : 0
      const totalBorrowed =
        poolStats?.total_borrowed != null
          ? fromTokenDecimals(Number(poolStats.total_borrowed as string | number), assetDecimals)
          : 0
      const utilization =
        poolStats?.utilization != null
          ? fromBasisPoints(poolStats.utilization as string | number)
          : 0
      const supplyAPY =
        poolStats?.supply_rate != null
          ? fromBasisPoints(poolStats.supply_rate as string | number)
          : 0
      const borrowAPY =
        poolStats?.borrow_rate != null
          ? fromBasisPoints(poolStats.borrow_rate as string | number)
          : 0
      const baseRate =
        pool.base_rate != null ? fromBasisPoints(pool.base_rate as string | number) : 0

      console.log('baseRate', baseRate)

      return {
        ...pool,
        asset,
        totalSupplied,
        totalBorrowed,
        utilization,
        supplyAPY,
        borrowAPY,
        baseRate,
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
