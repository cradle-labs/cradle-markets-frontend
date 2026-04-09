'use client'

import { useMemo } from 'react'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { useAssetDetail } from './AssetDetailProvider'
import { fromTokenDecimals } from '@repo/lib/modules/lend/utils'

interface OrderLevel {
  price: number
  amount: number
  total: number
}

const ROWS_PER_SIDE = 12

function formatNum(value: number, decimals: number): string {
  if (value === 0) return '--'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function SpotOrderBook() {
  const { orders, market, assetOne, assetTwo } = useAssetDetail()

  const baseDecimals = assetOne?.decimals != null ? Number(assetOne.decimals) : 6
  const quoteDecimals = assetTwo?.decimals != null ? Number(assetTwo.decimals) : 6

  // Derive bid/ask levels from open orders
  const { bids, asks, spread, midPrice } = useMemo(() => {
    if (!orders || !market || !assetOne) {
      return { bids: [] as OrderLevel[], asks: [] as OrderLevel[], spread: 0, midPrice: 0 }
    }

    const openOrders = orders.filter(o => o.status === 'open')

    // Buy orders: bid_asset is the base asset (what buyer wants to receive)
    // Sell orders: ask_asset is the base asset (what seller is offering)
    const buyOrders = openOrders.filter(o => o.bid_asset === assetOne.id)
    const sellOrders = openOrders.filter(o => o.ask_asset === assetOne.id)

    // Group buy orders by price (these are bids)
    const bidMap = new Map<string, { amount: number; price: number }>()
    buyOrders.forEach(order => {
      const price = parseFloat(order.price)
      const key = price.toFixed(4)
      const amount = fromTokenDecimals(parseFloat(order.bid_amount) - parseFloat(order.filled_bid_amount), baseDecimals)
      const existing = bidMap.get(key)
      if (existing) {
        existing.amount += amount
      } else {
        bidMap.set(key, { price, amount })
      }
    })

    // Group sell orders by price (these are asks)
    const askMap = new Map<string, { amount: number; price: number }>()
    sellOrders.forEach(order => {
      const price = parseFloat(order.price)
      const key = price.toFixed(4)
      const amount = fromTokenDecimals(parseFloat(order.ask_amount) - parseFloat(order.filled_ask_amount), baseDecimals)
      const existing = askMap.get(key)
      if (existing) {
        existing.amount += amount
      } else {
        askMap.set(key, { price, amount })
      }
    })

    // Sort bids descending (highest first), asks ascending (lowest first)
    const sortedBids = Array.from(bidMap.values())
      .sort((a, b) => b.price - a.price)
      .slice(0, ROWS_PER_SIDE)

    const sortedAsks = Array.from(askMap.values())
      .sort((a, b) => a.price - b.price)
      .slice(0, ROWS_PER_SIDE)

    // Calculate cumulative totals
    let bidTotal = 0
    const bidsWithTotal: OrderLevel[] = sortedBids.map(b => {
      bidTotal += b.amount
      return { price: b.price, amount: b.amount, total: bidTotal }
    })

    let askTotal = 0
    const asksWithTotal: OrderLevel[] = sortedAsks.map(a => {
      askTotal += a.amount
      return { price: a.price, amount: a.amount, total: askTotal }
    })

    const bestBid = sortedBids[0]?.price ?? 0
    const bestAsk = sortedAsks[0]?.price ?? 0
    const mid = bestBid > 0 && bestAsk > 0 ? (bestBid + bestAsk) / 2 : bestBid || bestAsk
    const sp = bestBid > 0 && bestAsk > 0 ? bestAsk - bestBid : 0

    return { bids: bidsWithTotal, asks: asksWithTotal, spread: sp, midPrice: mid }
  }, [orders, market, assetOne, baseDecimals])

  const maxBidTotal = bids.length > 0 ? bids[bids.length - 1].total : 1
  const maxAskTotal = asks.length > 0 ? asks[asks.length - 1].total : 1

  // Show asks reversed so lowest ask is at bottom (closest to spread)
  const displayAsks = [...asks].reverse()

  // Pad arrays to fill space
  const paddedAsks = [
    ...Array(Math.max(0, ROWS_PER_SIDE - displayAsks.length)).fill(null),
    ...displayAsks,
  ]
  const paddedBids = [
    ...bids,
    ...Array(Math.max(0, ROWS_PER_SIDE - bids.length)).fill(null),
  ]

  const quoteSymbol = assetTwo?.symbol ?? ''
  const baseSymbol = assetOne?.symbol ?? ''

  return (
    <VStack
      bg="background.level0"
      borderLeft="1px solid"
      borderColor="border.base"
      h="full"
      p={0}
      spacing={0}
      w="full"
    >
      {/* Header */}
      <Box borderBottom="1px solid" borderColor="border.base" px={3} py={2} w="full">
        <Text fontSize="sm" fontWeight="semibold">
          Order Book
        </Text>
      </Box>

      {/* Column headers */}
      <Grid gap={2} px={3} py={1} templateColumns="1fr 1fr 1fr" w="full">
        <Text color="font.secondary" fontSize="10px" fontWeight="semibold" textTransform="uppercase">
          Price ({quoteSymbol})
        </Text>
        <Text
          color="font.secondary"
          fontSize="10px"
          fontWeight="semibold"
          textAlign="right"
          textTransform="uppercase"
        >
          Amount ({baseSymbol})
        </Text>
        <Text
          color="font.secondary"
          fontSize="10px"
          fontWeight="semibold"
          textAlign="right"
          textTransform="uppercase"
        >
          Total
        </Text>
      </Grid>

      {/* Asks (sell orders) */}
      <Box flex={1} overflow="hidden" w="full">
        {paddedAsks.map((ask, idx) => {
          if (!ask) {
            return (
              <Grid
                fontFamily="mono"
                fontSize="11px"
                gap={2}
                key={`ask-pad-${idx}`}
                lineHeight="tight"
                opacity={0}
                px={3}
                py="2px"
                templateColumns="1fr 1fr 1fr"
              >
                <Text>-</Text>
                <Text textAlign="right">-</Text>
                <Text textAlign="right">-</Text>
              </Grid>
            )
          }
          const pct = (ask.total / maxAskTotal) * 100
          return (
            <Grid
              fontFamily="mono"
              fontSize="11px"
              gap={2}
              key={`ask-${idx}`}
              lineHeight="tight"
              position="relative"
              px={3}
              py="2px"
              templateColumns="1fr 1fr 1fr"
            >
              <Box
                bg="rgba(239, 68, 68, 0.08)"
                borderRadius="sm"
                bottom={0}
                position="absolute"
                right={0}
                top={0}
                width={`${pct}%`}
              />
              <Text color="red.400" fontSize="12px" position="relative" zIndex={1}>
                {formatNum(ask.price, 4)}
              </Text>
              <Text color="font.secondary" fontSize="12px" position="relative" textAlign="right" zIndex={1}>
                {formatNum(ask.amount, 4)}
              </Text>
              <Text color="font.secondary" fontSize="12px" opacity={0.7} position="relative" textAlign="right" zIndex={1}>
                {formatNum(ask.total, 4)}
              </Text>
            </Grid>
          )
        })}
      </Box>

      {/* Spread / Mid price */}
      <Box
        bg="background.level1"
        borderBottom="1px solid"
        borderColor="border.base"
        borderTop="1px solid"
        px={3}
        py={1.5}
        w="full"
      >
        <Flex fontSize="xs" gap={3} justify="center">
          <Box>
            <Text as="span" color="font.secondary" fontSize="11px">
              Mid{' '}
            </Text>
            <Text as="span" color="yellow.400" fontFamily="mono" fontWeight="semibold">
              {formatNum(midPrice, 4)}
            </Text>
          </Box>
          <Box bg="border.base" h={3} w="1px" />
          <Box>
            <Text as="span" color="font.secondary" fontSize="11px">
              Spread{' '}
            </Text>
            <Text as="span" color="blue.400" fontFamily="mono" fontWeight="semibold">
              {formatNum(spread, 4)}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Bids (buy orders) */}
      <Box flex={1} overflow="hidden" w="full">
        {paddedBids.map((bid, idx) => {
          if (!bid) {
            return (
              <Grid
                fontFamily="mono"
                fontSize="11px"
                gap={2}
                key={`bid-pad-${idx}`}
                lineHeight="tight"
                opacity={0}
                px={3}
                py="2px"
                templateColumns="1fr 1fr 1fr"
              >
                <Text>-</Text>
                <Text textAlign="right">-</Text>
                <Text textAlign="right">-</Text>
              </Grid>
            )
          }
          const pct = (bid.total / maxBidTotal) * 100
          return (
            <Grid
              fontFamily="mono"
              fontSize="11px"
              gap={2}
              key={`bid-${idx}`}
              lineHeight="tight"
              position="relative"
              px={3}
              py="2px"
              templateColumns="1fr 1fr 1fr"
            >
              <Box
                bg="rgba(34, 197, 94, 0.08)"
                borderRadius="sm"
                bottom={0}
                position="absolute"
                right={0}
                top={0}
                width={`${pct}%`}
              />
              <Text color="green.400" fontSize="12px" position="relative" zIndex={1}>
                {formatNum(bid.price, 4)}
              </Text>
              <Text color="font.secondary" fontSize="12px" position="relative" textAlign="right" zIndex={1}>
                {formatNum(bid.amount, 4)}
              </Text>
              <Text color="font.secondary" fontSize="12px" opacity={0.7} position="relative" textAlign="right" zIndex={1}>
                {formatNum(bid.total, 4)}
              </Text>
            </Grid>
          )
        })}
      </Box>

      {/* Empty state */}
      {bids.length === 0 && asks.length === 0 && (
        <Box px={3} py={4} textAlign="center" w="full">
          <Text color="font.secondary" fontSize="xs">
            No open orders
          </Text>
        </Box>
      )}
    </VStack>
  )
}
