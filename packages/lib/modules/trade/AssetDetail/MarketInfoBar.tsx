'use client'

import { Box, HStack, Text, Image, Divider } from '@chakra-ui/react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useAssetDetail } from './AssetDetailProvider'
import { useMemo } from 'react'

interface MarketInfoBarProps {
  asset: TokenizedAssetData
}

export function MarketInfoBar({ asset }: MarketInfoBarProps) {
  const { assetTwo, market } = useAssetDetail()
  const isPositive = asset.dailyChange >= 0
  const quoteSymbol = assetTwo?.symbol ?? asset.quoteAssetSymbol ?? '$'

  const formatPrice = (price: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price)
  }

  // Calculate 24h high/low/volume from timeHistoryData
  const { high24h, low24h, volume24h } = useMemo(() => {
    if (!asset.timeHistoryData || asset.timeHistoryData.length === 0) {
      return { high24h: 0, low24h: 0, volume24h: 0 }
    }

    const now = Date.now() / 1000
    const dayAgo = now - 86400
    const recentData = asset.timeHistoryData.filter(d => d.timestamp >= dayAgo)

    // If no data in last 24h, use all available data
    const data = recentData.length > 0 ? recentData : asset.timeHistoryData

    return {
      high24h: Math.max(...data.map(d => d.high)),
      low24h: Math.min(...data.map(d => d.low)),
      volume24h: data.reduce((sum, d) => sum + d.volume, 0),
    }
  }, [asset.timeHistoryData])

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(2)}K`
    return formatPrice(vol, 2)
  }

  const pairName = market?.name || `${asset.symbol}/${quoteSymbol}`

  return (
    <HStack
      bg="background.level0"
      borderBottom="1px solid"
      borderColor="border.base"
      h="56px"
      px={4}
      spacing={0}
      w="full"
    >
      {/* Market pair with icon */}
      <HStack minW="180px" spacing={2}>
        <Image
          alt={asset.name}
          borderRadius="full"
          boxSize="24px"
          fallback={
            <Box
              alignItems="center"
              bg="gray.600"
              borderRadius="full"
              boxSize="24px"
              display="flex"
              fontSize="xs"
              fontWeight="bold"
              justifyContent="center"
            >
              {asset.symbol.charAt(0)}
            </Box>
          }
          src={asset.logo}
        />
        <Text fontSize="md" fontWeight="bold">
          {pairName}
        </Text>
      </HStack>

      <Divider h="32px" orientation="vertical" />

      {/* Last price */}
      <Box minW="120px" px={4}>
        <Text
          color={isPositive ? 'green.400' : 'red.400'}
          fontFamily="mono"
          fontSize="lg"
          fontWeight="bold"
        >
          {formatPrice(asset.currentPrice, 4)}
        </Text>
      </Box>

      <Divider h="32px" orientation="vertical" />

      {/* 24h Change */}
      <Box px={4}>
        <Text color="font.secondary" fontSize="2xs" lineHeight="1">
          24h Change
        </Text>
        <Text
          color={isPositive ? 'green.400' : 'red.400'}
          fontFamily="mono"
          fontSize="sm"
          fontWeight="medium"
        >
          {isPositive ? '+' : ''}
          {formatPrice(asset.dailyChange, 4)} {isPositive ? '+' : ''}
          {asset.dailyChangePercent.toFixed(2)}%
        </Text>
      </Box>

      <Divider h="32px" orientation="vertical" />

      {/* 24h High */}
      <Box px={4}>
        <Text color="font.secondary" fontSize="2xs" lineHeight="1">
          24h High
        </Text>
        <Text fontFamily="mono" fontSize="sm" fontWeight="medium">
          {high24h > 0 ? formatPrice(high24h, 4) : '--'}
        </Text>
      </Box>

      <Divider h="32px" orientation="vertical" />

      {/* 24h Low */}
      <Box px={4}>
        <Text color="font.secondary" fontSize="2xs" lineHeight="1">
          24h Low
        </Text>
        <Text fontFamily="mono" fontSize="sm" fontWeight="medium">
          {low24h > 0 ? formatPrice(low24h, 4) : '--'}
        </Text>
      </Box>

      <Divider h="32px" orientation="vertical" />

      {/* 24h Volume */}
      <Box px={4}>
        <Text color="font.secondary" fontSize="2xs" lineHeight="1">
          24h Volume
        </Text>
        <Text fontFamily="mono" fontSize="sm" fontWeight="medium">
          {volume24h > 0 ? formatVolume(volume24h) : '--'}
        </Text>
      </Box>
    </HStack>
  )
}
