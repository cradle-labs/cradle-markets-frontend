'use client'

import { Card, Text, VStack } from '@chakra-ui/react'
import TradingChart from '@repo/lib/modules/perps/trading-chart/chart'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { AssetChartProvider, useAssetChart } from './AssetChartProvider'

interface AssetChartProps {
  asset: TokenizedAssetData
}

function AssetChartContent() {
  const { candlestickData, hasChartData, symbol } = useAssetChart()

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
