'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { LendingPoolTable, LendingPoolData } from './LendingPoolTable'
import { useLendingPools, useAssets } from '@repo/lib/cradle-client-ts/hooks'

export function LendDetails() {
  const router = useRouter()
  const { data: lendingPools, isLoading: isLoadingLendingPools } = useLendingPools()
  console.log('lendingPools', lendingPools)
  const { data: assets, isLoading: isLoadingAssets } = useAssets()
  console.log('assets', assets)

  // Enrich lending pool data with asset info and calculated values
  const enrichedPools: LendingPoolData[] = useMemo(() => {
    if (!lendingPools || !assets) return []

    return lendingPools.map(pool => {
      const asset = assets.find(a => a.id === pool.reserve_asset)

      // TODO: Replace with actual API data when available
      const totalSupplied = 0
      const totalBorrowed = 0
      const utilization = 0

      // Calculate APYs based on utilization and pool parameters
      const baseRate = parseFloat(pool.base_rate)
      const slope1 = parseFloat(pool.slope1)
      const slope2 = parseFloat(pool.slope2)

      // Simple interest rate model calculation
      let borrowAPY = baseRate
      if (utilization <= 0.8) {
        borrowAPY = baseRate + utilization * slope1
      } else {
        borrowAPY = baseRate + 0.8 * slope1 + (utilization - 0.8) * slope2
      }

      // Supply APY = Borrow APY * Utilization * (1 - Reserve Factor)
      const reserveFactor = parseFloat(pool.reserve_factor)
      const supplyAPY = borrowAPY * utilization * (1 - reserveFactor)

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
  }, [lendingPools, assets])

  const handlePoolClick = (pool: LendingPoolData) => {
    router.push(`/lend/${pool.id}`)
  }

  const isLoading = isLoadingLendingPools || isLoadingAssets

  return (
    <Box w="full">
      <LendingPoolTable loading={isLoading} onPoolClick={handlePoolClick} pools={enrichedPools} />
    </Box>
  )
}
