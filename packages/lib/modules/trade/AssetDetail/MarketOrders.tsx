'use client'

import {
  Box,
  Card,
  Text,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { useAssetDetail } from './AssetDetailProvider'

export function MarketOrders() {
  const { orders, market, loading } = useAssetDetail()

  if (loading) {
    return (
      <Card>
        <Box p={6}>
          <Text color="font.secondary">Loading orders...</Text>
        </Box>
      </Card>
    )
  }

  if (!market) {
    return (
      <Card>
        <Box p={6}>
          <Text color="font.secondary">Market not found</Text>
        </Box>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <Box p={6}>
          <VStack align="center" py={8} spacing={3}>
            <Text fontSize="lg" fontWeight="semibold">
              No orders found
            </Text>
            <Text color="font.secondary" fontSize="sm" textAlign="center">
              There are currently no orders for this market.
            </Text>
          </VStack>
        </Box>
      </Card>
    )
  }

  // Helper function to format status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'green'
      case 'closed':
        return 'gray'
      case 'cancelled':
        return 'red'
      default:
        return 'gray'
    }
  }

  // Helper function to format order type
  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'limit':
        return 'blue'
      case 'market':
        return 'purple'
      default:
        return 'gray'
    }
  }

  return (
    <Card>
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="semibold">
                Market Orders
              </Text>
              <Text color="font.secondary" fontSize="sm">
                {market.name} - {orders.length} order{orders.length !== 1 ? 's' : ''}
              </Text>
            </VStack>

            <HStack spacing={2}>
              <Badge colorScheme="green" variant="subtle">
                {orders.filter(o => o.status === 'open').length} Open
              </Badge>
              <Badge colorScheme="gray" variant="subtle">
                {orders.filter(o => o.status === 'closed').length} Closed
              </Badge>
              {orders.filter(o => o.status === 'cancelled').length > 0 && (
                <Badge colorScheme="red" variant="subtle">
                  {orders.filter(o => o.status === 'cancelled').length} Cancelled
                </Badge>
              )}
            </HStack>
          </HStack>

          <TableContainer w="full">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Type</Th>
                  <Th>Mode</Th>
                  <Th isNumeric>Amount</Th>
                  <Th isNumeric>Price</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map(order => (
                  <Tr key={order.id}>
                    <Td>
                      <Text fontFamily="mono" fontSize="xs">
                        {order.id}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getOrderTypeColor(order.order_type)} size="sm">
                        {order.order_type}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="xs">{order.mode}</Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontSize="sm">{parseFloat(order.ask_amount).toLocaleString()}</Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontSize="sm" fontWeight="medium">
                        $
                        {parseFloat(order.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)} size="sm">
                        {order.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="xs">
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Summary Statistics */}
          <Box bg="background.level1" borderRadius="md" mt={4} p={4} w="full">
            <VStack align="start" spacing={3}>
              <Text fontSize="sm" fontWeight="semibold">
                Order Summary
              </Text>
              <Box
                display="grid"
                gap={4}
                gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                w="full"
              >
                <VStack align="start" spacing={1}>
                  <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                    Total Volume
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {orders
                      .reduce((sum, order) => sum + parseFloat(order.ask_amount), 0)
                      .toLocaleString()}
                  </Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                    Avg. Price
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    $
                    {(
                      orders.reduce((sum, order) => sum + parseFloat(order.price), 0) /
                      orders.length
                    ).toFixed(2)}
                  </Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                    Total Value
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    $
                    {orders
                      .reduce((sum, order) => sum + parseFloat(order.bid_amount), 0)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Card>
  )
}
