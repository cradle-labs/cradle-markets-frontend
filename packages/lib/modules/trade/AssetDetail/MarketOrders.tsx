'use client'

import { useState } from 'react'
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
  Button,
  Select,
  IconButton,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useAssetDetail } from './AssetDetailProvider'

export function MarketOrders() {
  const { orders, market, loading } = useAssetDetail()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedOrders = orders.slice(startIndex, endIndex)

  // Reset to page 1 if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

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

          {/* Summary Statistics */}
          <Box bg="background.level1" borderRadius="md" p={4} w="full">
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
                {paginatedOrders.map(order => (
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

          {/* Pagination Controls */}
          {orders.length > 0 && (
            <HStack justify="space-between" pt={2} w="full">
              <HStack spacing={2}>
                <Text color="font.secondary" fontSize="sm">
                  Rows per page:
                </Text>
                <Select
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  size="sm"
                  value={pageSize}
                  w="80px"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </Select>
                <Text color="font.secondary" fontSize="sm">
                  {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length}
                </Text>
              </HStack>

              <HStack spacing={1}>
                <IconButton
                  aria-label="Previous page"
                  icon={<ChevronLeftIcon />}
                  isDisabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  size="sm"
                  variant="ghost"
                />

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .map((page, idx, arr) => {
                    // Add ellipsis between non-consecutive pages
                    const prevPage = arr[idx - 1]
                    const showEllipsis = prevPage && page - prevPage > 1

                    return (
                      <HStack key={page} spacing={1}>
                        {showEllipsis && (
                          <Text color="font.secondary" px={1}>
                            ...
                          </Text>
                        )}
                        <Button
                          minW="32px"
                          onClick={() => handlePageChange(page)}
                          size="sm"
                          variant={currentPage === page ? 'solid' : 'ghost'}
                        >
                          {page}
                        </Button>
                      </HStack>
                    )
                  })}

                <IconButton
                  aria-label="Next page"
                  icon={<ChevronRightIcon />}
                  isDisabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  size="sm"
                  variant="ghost"
                />
              </HStack>
            </HStack>
          )}
        </VStack>
      </Box>
    </Card>
  )
}
