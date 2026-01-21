'use client'

import {
  Box,
  Card,
  CardBody,
  HStack,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

export interface TokenizedAssetData {
  id: string
  symbol: string
  name: string
  logo: string
  currentPrice: number
  dailyChange: number
  dailyChangePercent: number
  priceHistory: Array<[number, number]> // [timestamp, price] pairs
  /**
   * Quote asset used for pricing this market (e.g., KESN)
   */
  quoteAssetSymbol?: string
  quoteAssetDecimals?: number
  /**
   * Optional full OHLCV history for detailed charts
   */
  timeHistoryData?: Array<{
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
}

interface TokenizedAssetCardProps {
  asset: TokenizedAssetData
  onClick?: () => void
}

export function TokenizedAssetCard({ asset, onClick }: TokenizedAssetCardProps) {
  console.log('asset', asset)
  const isPositive = asset.dailyChange >= 0
  const changeColor = useColorModeValue(
    isPositive ? 'green.500' : 'red.500',
    isPositive ? 'green.400' : 'red.400'
  )
  const changeBgColor = useColorModeValue(
    isPositive ? 'green.50' : 'red.50',
    isPositive ? 'green.900' : 'red.900'
  )
  const chartLineColor = useColorModeValue(
    isPositive ? '#38A169' : '#E53E3E',
    isPositive ? '#68D391' : '#FC8181'
  )
  const fallbackBg = useColorModeValue('gray.200', 'gray.600')
  const fallbackColor = useColorModeValue('gray.700', 'gray.200')

  const chartOptions = useMemo(
    () => ({
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },
      xAxis: {
        type: 'time',
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          type: 'line',
          data: asset.priceHistory,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: chartLineColor,
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${chartLineColor}20`,
                },
                {
                  offset: 1,
                  color: `${chartLineColor}05`,
                },
              ],
            },
          },
        },
      ],
      tooltip: {
        show: false,
      },
      animation: false,
    }),
    [asset.priceHistory, chartLineColor]
  )

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
    // Use quoteAssetSymbol (e.g., KESN, cpUSD) - matches logic from AssetHeader and AssetInfo
    console.log('asset.quoteAssetSymbol', asset.quoteAssetSymbol)
    const symbol = asset.quoteAssetSymbol ?? '$'
    const separator = symbol === '$' ? '' : ' '
    return `${symbol}${separator}${formatted}`
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${formatPrice(change)}`
  }

  const formatChangePercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  return (
    <Card
      _hover={
        onClick
          ? {
              shadow: 'md',
              transform: 'translateY(-2px)',
            }
          : {}
      }
      as={onClick ? 'button' : 'div'}
      cursor={onClick ? 'pointer' : 'default'}
      h="full"
      onClick={onClick}
      overflow="hidden"
      shadow="sm"
      transition="all 0.2s ease"
    >
      <CardBody p={4}>
        <VStack align="stretch" h="full" spacing={4}>
          {/* 1. Header (Top Left) - Logo, ticker, company name in horizontal row */}
          <HStack align="start" spacing={3}>
            <Box borderRadius="md" flexShrink={0} h={10} overflow="hidden" w={10}>
              <Image
                alt={`${asset.name} logo`}
                fallback={
                  <Box
                    alignItems="center"
                    bg={fallbackBg}
                    borderRadius="md"
                    display="flex"
                    h="full"
                    justifyContent="center"
                    w="full"
                  >
                    <Text color={fallbackColor} fontSize="lg" fontWeight="bold">
                      {asset.name.charAt(0).toUpperCase()}
                    </Text>
                  </Box>
                }
                h="full"
                objectFit="contain"
                src={asset.logo}
                w="full"
              />
            </Box>
            <VStack align="start" flex={1} spacing={0}>
              {/* Ticker symbol - bold */}
              <Text fontSize="lg" fontWeight="bold" lineHeight="1.2">
                {asset.symbol}
              </Text>
              {/* Company name - smaller and lighter */}
              <Text color="font.secondary" fontSize="sm" lineHeight="1.2">
                {asset.name}
              </Text>
            </VStack>
          </HStack>

          {/* 2. Price Info (Center) - Left aligned under header */}
          <VStack align="start" spacing={2}>
            {/* Current price - large, bold */}
            <Text fontSize="2xl" fontWeight="bold">
              {formatPrice(asset.currentPrice)}
            </Text>
            {/* 24H change - colored line with arrow, dollar change, percentage, and 24H label */}
            <HStack spacing={1}>
              {isPositive ? (
                <ChevronUpIcon color={changeColor} h={4} w={4} />
              ) : (
                <ChevronDownIcon color={changeColor} h={4} w={4} />
              )}
              <Text color={changeColor} fontSize="sm" fontWeight="medium">
                {formatChange(asset.dailyChange)} ({formatChangePercent(asset.dailyChangePercent)})
              </Text>
              <Text color="font.secondary" fontSize="sm">
                24H
              </Text>
            </HStack>
          </VStack>

          {/* 3. Chart (Bottom Area) - stretches across bottom width with soft background tint */}
          <Box
            bg={changeBgColor}
            borderRadius="md"
            h={20}
            overflow="hidden"
            position="relative"
            w="full"
          >
            <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} />
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
