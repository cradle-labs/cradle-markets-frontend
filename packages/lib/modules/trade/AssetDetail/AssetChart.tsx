'use client'

import { Box, Text, VStack } from '@chakra-ui/react'
import TradingChart from '@repo/lib/modules/perps/trading-chart/chart'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { AssetChartProvider, useAssetChart } from './AssetChartProvider'
import { useAssetDetail } from './AssetDetailProvider'

interface AssetChartProps {
  asset: TokenizedAssetData
}

function AssetChartContent() {
  const { candlestickData, hasChartData, symbol, activeTimeFrame, onTimeFrameChange } =
    useAssetChart()
  const { loading } = useAssetDetail()

  if (loading) {
    return (
      <Box bg="background.level0" h="full" w="full">
        <VStack align="center" h="full" justify="center">
          <Text color="font.secondary" fontSize="sm">
            Loading chart...
          </Text>
        </VStack>
      </Box>
    )
  }

  if (!hasChartData) {
    return (
      <Box bg="background.level0" h="full" w="full">
        <VStack align="center" h="full" justify="center" p={8}>
          <Text color="font.secondary" fontSize="lg" fontWeight="medium">
            No Price Data Available
          </Text>
          <Text color="font.tertiary" fontSize="sm" textAlign="center">
            Price history data is not available for this market yet.
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <TradingChart
      activeTimeFrame={activeTimeFrame}
      data={candlestickData}
      onTimeFrameChange={onTimeFrameChange}
      symbol={symbol}
    />
  )
}

export function AssetChart({ asset }: AssetChartProps) {
  return (
    <AssetChartProvider asset={asset}>
      <AssetChartContent />
    </AssetChartProvider>
  )
}
