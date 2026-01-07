'use client'

import { Card, Grid, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import type { ListingStats } from '@repo/lib/cradle-client-ts/cradle-api-client'
import { fromTokenDecimals } from '@repo/lib/modules/lend/utils'

interface ListingMetricsGridProps {
  purchasePrice: string
  maxSupply: string
  stats?: ListingStats
  status: string
  purchaseAssetSymbol?: string
  purchaseAssetDecimals?: number
}

export function ListingMetricsGrid({
  purchasePrice,
  maxSupply,
  stats,
  status,
  purchaseAssetSymbol = 'USD',
  purchaseAssetDecimals,
}: ListingMetricsGridProps) {
  console.log('purchaseAssetDecimals', purchaseAssetDecimals)
  // Convert from purchase asset decimals and format as currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    const normalizedAmount = fromTokenDecimals(numAmount, purchaseAssetDecimals ?? 6)
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(normalizedAmount)
    const symbol = purchaseAssetSymbol ?? '$'
    const separator = symbol === '$' ? '' : ' '
    return `${symbol}${separator}${formatted}`
  }

  // Convert from 8 decimals and format as compact number
  const formatNumber = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    const normalizedValue = fromTokenDecimals(numValue)
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(normalizedValue)
  }

  const totalDistributed = stats?.total_distributed ? Number(stats.total_distributed) : 0
  const remainingSupply = stats?.remaining ? Number(stats.remaining) : parseFloat(maxSupply)
  const totalRaised = stats?.raised ? Number(stats.raised) : 0
  const maxSupplyNum = parseFloat(maxSupply)
  // Percentage calculation doesn't need conversion since both are in same format
  const soldPercentage =
    maxSupplyNum > 0 ? ((totalDistributed / maxSupplyNum) * 100).toFixed(1) : '0'

  return (
    <Grid
      gap="6"
      mb="8"
      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
    >
      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Token Price
          </StatLabel>
          <StatNumber fontSize="2xl">{formatCurrency(purchasePrice)}</StatNumber>
          <StatHelpText color="text.tertiary">Per {purchaseAssetSymbol}</StatHelpText>
        </Stat>
      </Card>

      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Total Raised
          </StatLabel>
          <StatNumber fontSize="2xl">{formatCurrency(totalRaised)}</StatNumber>
          <StatHelpText color="text.tertiary">{soldPercentage}% of max supply sold</StatHelpText>
        </Stat>
      </Card>

      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Tokens Sold
          </StatLabel>
          <StatNumber fontSize="2xl">{formatNumber(totalDistributed)}</StatNumber>
          <StatHelpText color="text.tertiary">of {formatNumber(maxSupply)} max supply</StatHelpText>
        </Stat>
      </Card>

      <Card p="6">
        <Stat>
          <StatLabel color="text.secondary" fontSize="sm">
            Remaining Supply
          </StatLabel>
          <StatNumber color={status === 'open' ? 'green.500' : 'gray.500'} fontSize="2xl">
            {formatNumber(remainingSupply)}
          </StatNumber>
          <StatHelpText color="text.tertiary">Tokens available</StatHelpText>
        </Stat>
      </Card>
    </Grid>
  )
}
