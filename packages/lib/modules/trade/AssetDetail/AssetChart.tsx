'use client'

import { Box, Card, HStack, Skeleton, Text, VStack } from '@chakra-ui/react'
import TradingChart from '@repo/lib/modules/perps/trading-chart/chart'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { AssetChartProvider, useAssetChart } from './AssetChartProvider'
import { useAssetDetail } from './AssetDetailProvider'

interface AssetChartProps {
  asset: TokenizedAssetData
}

function ChartSkeleton() {
  return (
    <Card>
      <Box h="400px" overflow="hidden" position="relative">
        <Skeleton h="full" w="full" />

        {/* Chart header skeleton */}
        <Box left={4} position="absolute" right={4} top={4}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={2}>
              <Skeleton h="20px" w="120px" />
              <Skeleton h="28px" w="180px" />
            </VStack>
            <HStack spacing={2}>
              <Skeleton h="32px" w="60px" />
              <Skeleton h="32px" w="60px" />
              <Skeleton h="32px" w="60px" />
              <Skeleton h="32px" w="60px" />
              <Skeleton h="32px" w="60px" />
            </HStack>
          </HStack>
        </Box>

        {/* Chart area with simulated candlesticks */}
        <Box bottom={4} left={4} position="absolute" right={4}>
          <HStack align="end" h="200px" justify="space-between" w="full">
            <Skeleton h="80px" w="8px" />
            <Skeleton h="120px" w="8px" />
            <Skeleton h="60px" w="8px" />
            <Skeleton h="100px" w="8px" />
            <Skeleton h="140px" w="8px" />
            <Skeleton h="90px" w="8px" />
            <Skeleton h="110px" w="8px" />
            <Skeleton h="70px" w="8px" />
            <Skeleton h="130px" w="8px" />
            <Skeleton h="95px" w="8px" />
            <Skeleton h="115px" w="8px" />
            <Skeleton h="85px" w="8px" />
            <Skeleton h="105px" w="8px" />
            <Skeleton h="125px" w="8px" />
            <Skeleton h="75px" w="8px" />
            <Skeleton h="135px" w="8px" />
          </HStack>
        </Box>
      </Box>
    </Card>
  )
}

function AssetChartContent() {
  const { candlestickData, hasChartData, symbol } = useAssetChart()
  const { loading } = useAssetDetail()

  // Show skeleton while loading time series data
  if (loading) {
    return <ChartSkeleton />
  }

  if (!hasChartData) {
    return (
      <Card>
        <VStack align="center" h="400px" justify="center" p={8} w="full">
          <Text color="font.secondary" fontSize="lg" fontWeight="medium">
            No Price Data Available
          </Text>
          <Text color="font.tertiary" fontSize="sm" textAlign="center">
            Price history data is not available for this market at the moment. Please check back
            later.
          </Text>
        </VStack>
      </Card>
    )
  }

  return <TradingChart data={candlestickData} symbol={symbol} />
}

export function AssetChart({ asset }: AssetChartProps) {
  return (
    <AssetChartProvider asset={asset}>
      <AssetChartContent />
    </AssetChartProvider>
  )
}
