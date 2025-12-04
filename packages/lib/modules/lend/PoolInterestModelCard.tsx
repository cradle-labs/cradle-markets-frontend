'use client'

import { Card, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { formatBasisPointsAsPercent } from './utils'

interface PoolInterestModelCardProps {
  baseRate: string
  slope1?: string
  slope2?: string
  poolContractId: string
  poolAddress: string
}

export function PoolInterestModelCard({ baseRate }: PoolInterestModelCardProps) {
  const formatPercentage = (value: string) => {
    return formatBasisPointsAsPercent(value)
  }

  return (
    <Card p="6">
      <Heading mb="6" size="md">
        Interest Rate Model
      </Heading>
      <VStack align="stretch" divider={<Divider />} spacing="4">
        <HStack justify="space-between">
          <Text color="text.secondary">Base Rate</Text>
          <Text fontWeight="semibold">{formatPercentage(baseRate)}</Text>
        </HStack>
        {/* <HStack justify="space-between">
          <Text color="text.secondary">Slope 1 (0-80% util)</Text>
          <Text fontWeight="semibold">{formatPercentage(slope1)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="text.secondary">Slope 2 (80-100% util)</Text>
          <Text fontWeight="semibold">{formatPercentage(slope2)}</Text>
        </HStack> */}
      </VStack>
    </Card>
  )
}
