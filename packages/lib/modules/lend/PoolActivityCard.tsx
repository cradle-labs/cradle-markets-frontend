'use client'

import { Badge, Box, Card, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import type { LendingTransaction } from '@repo/lib/cradle-client-ts/types'

interface PoolActivityCardProps {
  transactions: LendingTransaction[]
}

export function PoolActivityCard({ transactions }: PoolActivityCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card p="6">
      <Heading mb="6" size="md">
        Recent Activity
      </Heading>
      <VStack align="stretch" spacing="3">
        {transactions.slice(0, 5).map(tx => (
          <Box borderColor="border.base" borderRadius="md" borderWidth="1px" key={tx.id} p="4">
            <HStack justify="space-between">
              <HStack spacing="3">
                <Badge colorScheme={tx.transaction_type === 'supply' ? 'green' : 'red'}>
                  {tx.transaction_type}
                </Badge>
                <Text fontSize="sm">{formatCurrency(tx.amount)}</Text>
              </HStack>
              <Text color="text.secondary" fontSize="xs">
                {new Date(tx.created_at).toLocaleDateString()}
              </Text>
            </HStack>
          </Box>
        ))}
        {transactions.length === 0 && (
          <Text color="text.secondary" textAlign="center">
            No transactions yet
          </Text>
        )}
      </VStack>
    </Card>
  )
}
