'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { LendingPoolTable, LendingPoolData } from './LendingPoolTable'
import {
  mockLendingPools,
  mockAssets,
  getTotalSuppliedToPool,
  getTotalBorrowedFromPool,
  getPoolUtilizationRate,
} from '@repo/lib/shared/dummy-data/cradle-data'
import { useLendingPools } from '@repo/lib/cradle-client-ts/hooks'

export function LendDetails() {
  const router = useRouter()
  const [loading] = useState(false)
  const { data: lendingPools, isLoading: isLoadingLendingPools } = useLendingPools()
  console.log('lending pools', lendingPools)
  console.log('isLoadingLendingPools', isLoadingLendingPools)

  // Enrich lending pool data with asset info and calculated values
  const enrichedPools: LendingPoolData[] = useMemo(() => {
    return mockLendingPools.map(pool => {
      const asset = mockAssets.find(a => a.id === pool.reserve_asset)
      const totalSupplied = getTotalSuppliedToPool(pool.id)
      const totalBorrowed = getTotalBorrowedFromPool(pool.id)
      const utilization = getPoolUtilizationRate(pool.id)

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
  }, [])

  const handlePoolClick = (pool: LendingPoolData) => {
    router.push(`/lend/${pool.id}`)
  }

  return (
    <Box w="full">
      <LendingPoolTable loading={loading} onPoolClick={handlePoolClick} pools={enrichedPools} />
    </Box>
  )
}
