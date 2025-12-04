'use client'

import { useState, useMemo } from 'react'
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { fromTokenDecimals } from '@repo/lib/modules/lend'
import { useAssetDetail } from './AssetDetailProvider'

export function MarketOrders() {
  const { orders, market, loading } = useAssetDetail()
  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeTab, setActiveTab] = useState(0) // 0 = Open, 1 = Closed

  // First get the account ID using the Clerk user ID
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  // Fetch wallet for the account
  const { data: wallet, isLoading: isLoadingWallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  console.log('User wallet:', wallet)
  console.log('All orders:', orders)

  // Filter orders by user's wallet
  const userOrders = useMemo(() => {
    if (!wallet?.id) return []
    return orders.filter(order => order.wallet === wallet.id)
  }, [orders, wallet?.id])

  console.log('User orders:', userOrders)

  // Split orders by status
  const openOrders = useMemo(() => {
    return userOrders.filter(order => order.status === 'open')
  }, [userOrders])

  const closedOrders = useMemo(() => {
    return userOrders.filter(order => order.status === 'closed' || order.status === 'cancelled')
  }, [userOrders])

  // Get current orders based on active tab
  const currentOrders = activeTab === 0 ? openOrders : closedOrders

  // Pagination calculations
  const totalPages = Math.ceil(currentOrders.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedOrders = currentOrders.slice(startIndex, endIndex)

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

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  // Helper function to format date in UTC
  const formatDateUTC = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  }

  if (loading || isLoadingWallet) {
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

  if (!wallet) {
    return (
      <Card>
        <Box p={6}>
          <VStack align="center" py={8} spacing={3}>
            <Text fontSize="lg" fontWeight="semibold">
              Wallet not found
            </Text>
            <Text color="font.secondary" fontSize="sm" textAlign="center">
              Please connect your wallet to view your orders.
            </Text>
          </VStack>
        </Box>
      </Card>
    )
  }

  if (userOrders.length === 0) {
    return (
      <Card>
        <Box p={6}>
          <VStack align="center" py={8} spacing={3}>
            <Text fontSize="lg" fontWeight="semibold">
              No orders found
            </Text>
            <Text color="font.secondary" fontSize="sm" textAlign="center">
              You don't have any orders for this market yet.
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

  // Render order table
  const renderOrderTable = (orders: typeof paginatedOrders) => (
    <>
      <TableContainer w="full">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Mode</Th>
              <Th isNumeric>Amount</Th>
              <Th isNumeric>Price</Th>
              <Th>Status</Th>
              <Th>Date (UTC)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map(order => (
              <Tr key={order.id}>
                <Td>
                  <Badge colorScheme={getOrderTypeColor(order.order_type)} size="sm">
                    {order.order_type}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="xs">{order.mode}</Text>
                </Td>
                <Td isNumeric>
                  <Text fontSize="sm">
                    ${fromTokenDecimals(parseFloat(order.ask_amount)).toLocaleString()}
                  </Text>
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
                  <Text fontSize="xs">{formatDateUTC(order.created_at)}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {currentOrders.length > 0 && (
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
              {startIndex + 1}-{Math.min(endIndex, currentOrders.length)} of {currentOrders.length}
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
    </>
  )

  return (
    <Card>
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="semibold">
                My Orders
              </Text>
              <Text color="font.secondary" fontSize="sm">
                {market.name} - {userOrders.length} order{userOrders.length !== 1 ? 's' : ''}
              </Text>
            </VStack>

            <HStack spacing={2}>
              <Badge colorScheme="green" variant="subtle">
                {openOrders.length} Open
              </Badge>
              <Badge colorScheme="gray" variant="subtle">
                {closedOrders.length} Closed
              </Badge>
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
                    $
                    {userOrders
                      .reduce(
                        (sum, order) => sum + fromTokenDecimals(parseFloat(order.ask_amount)),
                        0
                      )
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                    Avg. Price
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    $
                    {userOrders.length > 0
                      ? (
                          userOrders.reduce((sum, order) => sum + parseFloat(order.price), 0) /
                          userOrders.length
                        ).toFixed(2)
                      : '0.00'}
                  </Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                    Total Shares
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {userOrders
                      .reduce(
                        (sum, order) => sum + fromTokenDecimals(parseFloat(order.bid_amount)),
                        0
                      )
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Tabs for Open and Closed Orders */}
          <Tabs index={activeTab} onChange={handleTabChange} w="full">
            <TabList>
              <Tab>
                Open Orders
                <Badge colorScheme="green" ml={2} variant="subtle">
                  {openOrders.length}
                </Badge>
              </Tab>
              <Tab>
                Closed Orders
                <Badge colorScheme="gray" ml={2} variant="subtle">
                  {closedOrders.length}
                </Badge>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                {openOrders.length === 0 ? (
                  <VStack align="center" py={8} spacing={3}>
                    <Text fontSize="md" fontWeight="semibold">
                      No open orders
                    </Text>
                    <Text color="font.secondary" fontSize="sm" textAlign="center">
                      You don't have any open orders for this market.
                    </Text>
                  </VStack>
                ) : (
                  renderOrderTable(paginatedOrders)
                )}
              </TabPanel>

              <TabPanel px={0}>
                {closedOrders.length === 0 ? (
                  <VStack align="center" py={8} spacing={3}>
                    <Text fontSize="md" fontWeight="semibold">
                      No closed orders
                    </Text>
                    <Text color="font.secondary" fontSize="sm" textAlign="center">
                      You don't have any closed orders for this market.
                    </Text>
                  </VStack>
                ) : (
                  renderOrderTable(paginatedOrders)
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </Card>
  )
}
