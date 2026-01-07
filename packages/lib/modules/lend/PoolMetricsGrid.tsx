'use client'

import { Card, Grid, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'

interface PoolMetricsGridProps {
  totalSupplied: number
  availableLiquidity: number
  totalBorrowed: number
  activeLoansCount: number
  supplyAPY: number
  borrowAPY?: number
  baseRate: number
}

export function PoolMetricsGrid({
  totalSupplied,
  availableLiquidity,
  totalBorrowed,
  activeLoansCount,
  supplyAPY,
  borrowAPY,
  baseRate,
}: PoolMetricsGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  console.log('baseRate', baseRate)
  console.log('borrowAPY', borrowAPY)

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <Grid
      gap="6"
      mb="8"
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
    >
      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Total Supplied
          </StatLabel>
          <StatNumber fontSize="2xl">{formatCurrency(totalSupplied)}</StatNumber>
          <StatHelpText color="text.tertiary">
            Available: {formatCurrency(availableLiquidity)}
          </StatHelpText>
        </Stat>
      </Card>

      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Total Borrowed
          </StatLabel>
          <StatNumber fontSize="2xl">{formatCurrency(totalBorrowed)}</StatNumber>
          <StatHelpText color="text.tertiary">{activeLoansCount} active loans</StatHelpText>
        </Stat>
      </Card>

      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Supply APY
          </StatLabel>
          <StatNumber color="green.500" fontSize="2xl">
            {formatPercentage(supplyAPY)}
          </StatNumber>
          <StatHelpText color="text.tertiary">Current rate</StatHelpText>
        </Stat>
      </Card>

      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Borrow APY
          </StatLabel>
          <StatNumber color="orange.500" fontSize="2xl">
            {formatPercentage(baseRate)}
          </StatNumber>
          <StatHelpText color="text.tertiary">Base rate</StatHelpText>
        </Stat>
      </Card>
    </Grid>
  )
}
