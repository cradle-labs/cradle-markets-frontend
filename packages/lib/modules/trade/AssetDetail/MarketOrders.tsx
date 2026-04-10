'use client'

import { useState, useMemo } from 'react'
import {
  Box,
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
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { fromTokenDecimals } from '@repo/lib/modules/lend'
import { useAssetDetail } from './AssetDetailProvider'

export function MarketOrders() {
  const { orders, market, loading, assetOne, assetTwo } = useAssetDetail()
  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeTab, setActiveTab] = useState(0)

  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  const { data: wallet, isLoading: isLoadingWallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  const userOrders = useMemo(() => {
    if (!wallet?.id) return []
    return orders.filter(order => order.wallet === wallet.id)
  }, [orders, wallet?.id])

  const openOrders = useMemo(() => {
    return userOrders.filter(order => order.status === 'open')
  }, [userOrders])

  const closedOrders = useMemo(() => {
    return userOrders.filter(order => order.status === 'closed' || order.status === 'cancelled')
  }, [userOrders])

  const currentOrders = activeTab === 0 ? openOrders : closedOrders

  const totalPages = Math.ceil(currentOrders.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedOrders = currentOrders.slice(startIndex, endIndex)

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setCurrentPage(1)
  }

  const formatDateUTC = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
  }

  if (loading || isLoadingWallet) {
    return (
      <Box p={4}>
        <Text color="font.secondary" fontSize="sm">
          Loading orders...
        </Text>
      </Box>
    )
  }

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

  const quoteSymbol = assetTwo?.symbol ?? '$'
  const quoteDecimals = assetTwo?.decimals != null ? Number(assetTwo.decimals) : 6

  const formatQuoteAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    const normalized = fromTokenDecimals(num, quoteDecimals)
    return normalized.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatQuotePrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })
  }

  const renderOrderTable = (ordersToRender: typeof paginatedOrders) => (
    <TableContainer w="full">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th fontSize="10px">Type</Th>
            <Th fontSize="10px">Mode</Th>
            <Th fontSize="10px" isNumeric>
              Amount ({quoteSymbol})
            </Th>
            <Th fontSize="10px" isNumeric>
              Price
            </Th>
            <Th fontSize="10px">Status</Th>
            <Th fontSize="10px">Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ordersToRender.map(order => (
            <Tr key={order.id}>
              <Td py={1}>
                <Badge colorScheme={getOrderTypeColor(order.order_type)} fontSize="10px">
                  {order.order_type}
                </Badge>
              </Td>
              <Td py={1}>
                <Text fontSize="xs">{order.mode}</Text>
              </Td>
              <Td isNumeric py={1}>
                <Text fontFamily="mono" fontSize="xs">
                  {formatQuoteAmount(order.ask_amount)}
                </Text>
              </Td>
              <Td isNumeric py={1}>
                <Text fontFamily="mono" fontSize="xs" fontWeight="medium">
                  {formatQuotePrice(order.price)}
                </Text>
              </Td>
              <Td py={1}>
                <Badge colorScheme={getStatusColor(order.status)} fontSize="10px">
                  {order.status}
                </Badge>
              </Td>
              <Td py={1}>
                <Text fontSize="xs">{formatDateUTC(order.created_at)}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )

  return (
    <Box bg="background.level0" display="flex" flexDirection="column" h="full" overflow="hidden" w="full">
      {/* Header */}
      <HStack borderBottom="1px solid" borderColor="border.base" flexShrink={0} px={4} py={2}>
        <Text fontSize="sm" fontWeight="semibold">
          My Orders
        </Text>
        <Badge colorScheme="green" fontSize="10px" variant="subtle">
          {openOrders.length} Open
        </Badge>
        <Badge colorScheme="gray" fontSize="10px" variant="subtle">
          {closedOrders.length} Closed
        </Badge>
      </HStack>

      {!wallet || !market ? (
        <VStack align="center" py={6} spacing={2}>
          <Text color="font.secondary" fontSize="sm">
            {!wallet ? 'Connect wallet to view orders' : 'Market not found'}
          </Text>
        </VStack>
      ) : userOrders.length === 0 ? (
        <VStack align="center" py={6} spacing={2}>
          <Text color="font.secondary" fontSize="sm">
            No orders for this market yet
          </Text>
        </VStack>
      ) : (
        <Box display="flex" flex={1} flexDirection="column" minH={0} overflow="hidden" px={2}>
          <Tabs display="flex" flex={1} flexDirection="column" index={activeTab} minH={0} onChange={handleTabChange} overflow="hidden" size="sm">
            <TabList borderBottom="1px solid" borderColor="border.base">
              <Tab fontSize="xs" py={2}>
                Open ({openOrders.length})
              </Tab>
              <Tab fontSize="xs" py={2}>
                History ({closedOrders.length})
              </Tab>
            </TabList>

            <TabPanels flex={1} minH={0} overflowY="auto">
              <TabPanel p={0} pt={1}>
                {openOrders.length === 0 ? (
                  <Text color="font.secondary" fontSize="xs" py={4} textAlign="center">
                    No open orders
                  </Text>
                ) : (
                  renderOrderTable(paginatedOrders)
                )}
              </TabPanel>
              <TabPanel p={0} pt={1}>
                {closedOrders.length === 0 ? (
                  <Text color="font.secondary" fontSize="xs" py={4} textAlign="center">
                    No order history
                  </Text>
                ) : (
                  renderOrderTable(paginatedOrders)
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Compact pagination */}
          {totalPages > 1 && (
            <HStack justify="end" pb={2} pr={2} spacing={1}>
              <Text color="font.secondary" fontSize="xs">
                {startIndex + 1}-{Math.min(endIndex, currentOrders.length)} of{' '}
                {currentOrders.length}
              </Text>
              <IconButton
                aria-label="Previous"
                icon={<ChevronLeftIcon />}
                isDisabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                size="xs"
                variant="ghost"
              />
              <IconButton
                aria-label="Next"
                icon={<ChevronRightIcon />}
                isDisabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                size="xs"
                variant="ghost"
              />
            </HStack>
          )}
        </Box>
      )}
    </Box>
  )
}
