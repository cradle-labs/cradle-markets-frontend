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
    <Box
      bg="background.level0"
      display="flex"
      flexDirection="column"
      h="calc(100vh - 72px)"
      overflow="hidden"
      w="full"
    >
      {/* Top: Market info bar */}
      <MarketInfoBar asset={asset} />

      {/* Main grid — fills remaining viewport, no page scroll */}
      <Grid
        flex={1}
        minH={0}
        templateColumns={{ base: '1fr', lg: '1fr 280px' }}
        templateRows="60% 40%"
        w="full"
      >
        {/* Top-left: Chart */}
        <GridItem borderBottom="1px solid" borderColor="border.base" minH={0} overflow="hidden">
          <AssetChart asset={asset} />
        </GridItem>

        {/* Top-right: Order Book */}
        <GridItem
          borderBottom="1px solid"
          borderColor="border.base"
          display={{ base: 'none', lg: 'flex' }}
          minH={0}
          overflow="hidden"
        >
          <SpotOrderBook />
        </GridItem>

        {/* Bottom-left: Market Orders */}
        <GridItem display="flex" flexDirection="column" minH={0} overflow="hidden">
          <MarketOrders />
        </GridItem>

        {/* Bottom-right: Trading Panel */}
        <GridItem
          borderColor="border.base"
          borderLeft="1px solid"
          display={{ base: 'none', lg: 'flex' }}
          flexDirection="column"
          minH={0}
          overflow="hidden"
        >
          <AssetTradingPanel asset={asset} />
        </GridItem>
      </Grid>
    </Box>
  )
}

function AssetDetailSkeleton() {
  return (
    <Box
      bg="background.level0"
      display="flex"
      flexDirection="column"
      h="calc(100vh - 72px)"
      overflow="hidden"
      w="full"
    >
      {/* Info bar skeleton */}
      <HStack
        borderBottom="1px solid"
        borderColor="border.base"
        flexShrink={0}
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
        minH={0}
        templateColumns={{ base: '1fr', lg: '1fr 280px' }}
        templateRows="60% 40%"
      >
        <GridItem borderBottom="1px solid" borderColor="border.base" p={4}>
          <Skeleton h="full" w="full" />
        </GridItem>
        <GridItem
          borderBottom="1px solid"
          borderColor="border.base"
          borderLeft="1px solid"
          display={{ base: 'none', lg: 'block' }}
          p={2}
        >
          <VStack spacing={1}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton h="14px" key={i} w="full" />
            ))}
          </VStack>
        </GridItem>
        <GridItem p={4}>
          <Skeleton h="full" w="full" />
        </GridItem>
        <GridItem
          borderColor="border.base"
          borderLeft="1px solid"
          display={{ base: 'none', lg: 'block' }}
          p={4}
        >
          <Skeleton h="full" w="full" />
        </GridItem>
      </Grid>
    </Box>
  )
}

function AssetDetailError({ error }: { error: string | null }) {
  return (
    <VStack h="calc(100vh - 72px)" justify="center" spacing={4}>
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
