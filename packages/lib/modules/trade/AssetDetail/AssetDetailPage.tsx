'use client'

import { Box, Grid, GridItem, HStack, Skeleton, Text, VStack } from '@chakra-ui/react'
import { AssetDetailProvider, useAssetDetail } from './AssetDetailProvider'
import { MarketInfoBar } from './MarketInfoBar'
import { AssetChart } from './AssetChart'
import { AssetTradingPanel } from './AssetTradingPanel'
import { MarketOrders } from './MarketOrders'
import { SpotOrderBook } from './SpotOrderBook'

interface AssetDetailPageProps {
  marketId: string
}

function AssetDetailContent() {
  const { asset, loading, error } = useAssetDetail()

  if (loading) {
    return <AssetDetailSkeleton />
  }

  if (error || !asset) {
    return <AssetDetailError error={error} />
  }

  return (
    <Box bg="background.level0" display="flex" flexDirection="column" minH="100vh" w="full">
      {/* Top: Market info bar */}
      <MarketInfoBar asset={asset} />

      {/* Main grid: Chart + Order Book (top), Orders + Trading Panel (bottom) */}
      <Grid
        flex={1}
        templateColumns={{ base: '1fr', lg: '1fr 280px' }}
        templateRows="minmax(450px, 1fr) minmax(300px, auto)"
        w="full"
      >
        {/* Top-left: Chart */}
        <GridItem borderBottom="1px solid" borderColor="border.base" overflow="hidden">
          <AssetChart asset={asset} />
        </GridItem>

        {/* Top-right: Order Book */}
        <GridItem
          borderBottom="1px solid"
          borderColor="border.base"
          display={{ base: 'none', lg: 'block' }}
          overflow="hidden"
        >
          <SpotOrderBook />
        </GridItem>

        {/* Bottom-left: Market Orders */}
        <GridItem overflow="auto" p={0}>
          <MarketOrders />
        </GridItem>

        {/* Bottom-right: Trading Panel */}
        <GridItem
          borderColor="border.base"
          borderLeft="1px solid"
          display={{ base: 'none', lg: 'block' }}
          overflow="auto"
        >
          <AssetTradingPanel asset={asset} />
        </GridItem>
      </Grid>
    </Box>
  )
}

function AssetDetailSkeleton() {
  return (
    <Box bg="background.level0" minH="100vh" w="full">
      {/* Info bar skeleton */}
      <HStack
        borderBottom="1px solid"
        borderColor="border.base"
        h="56px"
        px={4}
        spacing={6}
      >
        <Skeleton h="24px" w="120px" />
        <Skeleton h="24px" w="100px" />
        <Skeleton h="16px" w="80px" />
        <Skeleton h="16px" w="80px" />
        <Skeleton h="16px" w="80px" />
        <Skeleton h="16px" w="80px" />
      </HStack>

      <Grid
        flex={1}
        h="calc(100vh - 56px)"
        templateColumns={{ base: '1fr', lg: '1fr 280px' }}
        templateRows="1fr auto"
      >
        {/* Chart skeleton */}
        <GridItem borderBottom="1px solid" borderColor="border.base" p={4}>
          <VStack align="start" h="full" spacing={4}>
            <HStack spacing={2}>
              <Skeleton h="20px" w="80px" />
              <Skeleton h="20px" w="60px" />
            </HStack>
            <Skeleton flex={1} w="full" />
          </VStack>
        </GridItem>

        {/* Order book skeleton */}
        <GridItem
          borderBottom="1px solid"
          borderColor="border.base"
          borderLeft="1px solid"
          display={{ base: 'none', lg: 'block' }}
          p={2}
        >
          <VStack spacing={1}>
            <Skeleton h="20px" w="full" />
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton h="16px" key={i} w="full" />
            ))}
          </VStack>
        </GridItem>

        {/* Bottom skeleton */}
        <GridItem p={4}>
          <Skeleton h="200px" w="full" />
        </GridItem>
        <GridItem
          borderColor="border.base"
          borderLeft="1px solid"
          display={{ base: 'none', lg: 'block' }}
          p={4}
        >
          <Skeleton h="300px" w="full" />
        </GridItem>
      </Grid>
    </Box>
  )
}

function AssetDetailError({ error }: { error: string | null }) {
  return (
    <VStack py={8} spacing={4}>
      <Box color="red.500" fontSize="lg" fontWeight="semibold">
        Error loading asset
      </Box>
      {error && (
        <Box color="font.secondary" textAlign="center">
          {error}
        </Box>
      )}
    </VStack>
  )
}

export function AssetDetailPage({ marketId }: AssetDetailPageProps) {
  return (
    <AssetDetailProvider marketId={marketId}>
      <AssetDetailContent />
    </AssetDetailProvider>
  )
}
