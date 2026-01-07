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
  assetSymbol?: string
}

export function PoolMetricsGrid({
  totalSupplied,
  availableLiquidity,
  totalBorrowed,
  activeLoansCount,
  supplyAPY,
  borrowAPY,
  baseRate,
  assetSymbol,
}: PoolMetricsGridProps) {
  const borrowRateHelpText = borrowAPY != null ? 'Current rate' : 'Base rate'
  console.log('assetSymbol', assetSymbol)
  console.log('totalSupplied', totalSupplied)

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
    const symbol = assetSymbol ?? '$'
    const separator = symbol === '$' ? '' : ' '
    return `${symbol}${separator}${formatted}`
  }

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
          <StatHelpText color="text.tertiary">{borrowRateHelpText}</StatHelpText>
        </Stat>
      </Card>
    </Grid>
  )
}
