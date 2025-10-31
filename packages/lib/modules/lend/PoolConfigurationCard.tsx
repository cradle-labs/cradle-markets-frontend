'use client'

import { Card, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/react'

interface PoolConfigurationCardProps {
  loanToValue: string
  liquidationThreshold: string
  liquidationDiscount: string
  reserveFactor: string
  utilization: number
}

export function PoolConfigurationCard({
  loanToValue,
  liquidationThreshold,
  liquidationDiscount,
  reserveFactor,
  utilization,
}: PoolConfigurationCardProps) {
  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return `${(numValue * 100).toFixed(2)}%`
  }

  return (
    <Card p="6">
      <Heading mb="6" size="md">
        Pool Configuration
      </Heading>
      <VStack align="stretch" divider={<Divider />} spacing="4">
        <HStack justify="space-between">
          <Text color="text.secondary">Loan to Value (LTV)</Text>
          <Text fontWeight="semibold">{formatPercentage(loanToValue)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="text.secondary">Liquidation Threshold</Text>
          <Text fontWeight="semibold">{formatPercentage(liquidationThreshold)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="text.secondary">Liquidation Discount</Text>
          <Text fontWeight="semibold">{formatPercentage(liquidationDiscount)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="text.secondary">Reserve Factor</Text>
          <Text fontWeight="semibold">{formatPercentage(reserveFactor)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="text.secondary">Utilization Rate</Text>
          <Text fontWeight="semibold">{formatPercentage(utilization)}</Text>
        </HStack>
      </VStack>
    </Card>
  )
}
