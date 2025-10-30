'use client'

import { useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { LendingPoolTable, LendingPoolData } from './LendingPoolTable'
import {
  mockLendingPools,
  mockAssets,
  getTotalSuppliedToPool,
  getTotalBorrowedFromPool,
  getPoolUtilizationRate,
} from '@repo/lib/shared/dummy-data/cradle-data'

export function LendDetails() {
  const [loading] = useState(false)

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
    // TODO: Navigate to pool details page or open modal
    console.log('Pool clicked:', pool)
  }

  return (
    <Box w="full">
      <LendingPoolTable loading={loading} onPoolClick={handlePoolClick} pools={enrichedPools} />
    </Box>
  )
}
