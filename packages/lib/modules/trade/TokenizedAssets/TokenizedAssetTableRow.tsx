'use client'

import {
  Box,
  Grid,
  GridItem,
  GridProps,
  HStack,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { TokenizedAssetData } from './TokenizedAssetCard'

interface TokenizedAssetTableRowProps extends GridProps {
  asset: TokenizedAssetData
  index: number
  onAssetClick?: (asset: TokenizedAssetData) => void
}

export function TokenizedAssetTableRow({
  asset,
  index,
  onAssetClick,
  ...rest
}: TokenizedAssetTableRowProps) {
  const isPositive = asset.dailyChange >= 0
  const changeColor = useColorModeValue(
    isPositive ? 'green.500' : 'red.500',
    isPositive ? 'green.400' : 'red.400'
  )
  const chartLineColor = useColorModeValue(
    isPositive ? '#38A169' : '#E53E3E',
    isPositive ? '#68D391' : '#FC8181'
  )
  const fallbackBg = useColorModeValue('gray.200', 'gray.600')
  const fallbackColor = useColorModeValue('gray.700', 'gray.200')

  // Generate mock volume data
  const volume = Math.floor(asset.currentPrice * Math.random() * 1000000)

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
            width: 1.5,
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

  const formatVolume = (vol: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(vol)
    const symbol = asset.quoteAssetSymbol ?? '$'
    const separator = symbol === '$' ? '' : ' '
    return `${symbol}${separator}${formatted}`
  }

  return (
    <FadeInOnView>
      <Box
        _hover={{
          bg: 'background.level0',
        }}
        as={onAssetClick ? 'button' : 'div'}
        cursor={onAssetClick ? 'pointer' : 'default'}
        onClick={onAssetClick ? () => onAssetClick(asset) : undefined}
        px={{ base: '0', sm: 'md' }}
        rounded="md"
        transition="all 0.2s ease-in-out"
        w="full"
      >
        <Grid pr="4" py={{ base: 'ms', md: 'md' }} {...rest}>
          {/* Row Number */}
          <GridItem>
            <Text color="font.secondary" fontSize="sm">
              {index + 1}
            </Text>
          </GridItem>

          {/* Asset Name */}
          <GridItem>
            <HStack align="start" spacing={3}>
              <Box borderRadius="md" flexShrink={0} h={8} overflow="hidden" w={8}>
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
                      <Text color={fallbackColor} fontSize="sm" fontWeight="bold">
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
                <Text fontSize="sm" fontWeight="bold">
                  {asset.symbol}
                </Text>
                <Text color="font.secondary" fontSize="xs">
                  {asset.name}
                </Text>
              </VStack>
            </HStack>
          </GridItem>

          {/* Price */}
          <GridItem justifySelf="end">
            <Text fontSize="sm" fontWeight="medium">
              {formatPrice(asset.currentPrice)}
            </Text>
          </GridItem>

          {/* 24h Change ($) */}
          <GridItem justifySelf="end">
            <HStack justify="end" spacing={1}>
              {isPositive ? (
                <ChevronUpIcon color={changeColor} h={3} w={3} />
              ) : (
                <ChevronDownIcon color={changeColor} h={3} w={3} />
              )}
              <Text color={changeColor} fontSize="sm" fontWeight="medium">
                {formatChange(asset.dailyChange)}
              </Text>
            </HStack>
          </GridItem>

          {/* 24h Change (%) */}
          <GridItem justifySelf="end">
            <HStack justify="end" spacing={1}>
              {isPositive ? (
                <ChevronUpIcon color={changeColor} h={3} w={3} />
              ) : (
                <ChevronDownIcon color={changeColor} h={3} w={3} />
              )}
              <Text color={changeColor} fontSize="sm" fontWeight="medium">
                {formatChangePercent(asset.dailyChangePercent)}
              </Text>
            </HStack>
          </GridItem>

          {/* 24H Volume */}
          <GridItem justifySelf="end">
            <Text fontSize="sm" fontWeight="medium">
              {formatVolume(volume)}
            </Text>
          </GridItem>

          {/* 24h Chart */}
          <GridItem justifySelf="center">
            <Box borderRadius="sm" h={8} overflow="hidden" w="120px">
              <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </FadeInOnView>
  )
}
