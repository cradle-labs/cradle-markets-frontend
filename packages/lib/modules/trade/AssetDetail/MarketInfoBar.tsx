'use client'

import { Box, HStack, Text, Image, Divider, Tooltip, IconButton } from '@chakra-ui/react'
import { ArrowLeft } from 'react-feather'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useAssetDetail } from './AssetDetailProvider'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface MarketInfoBarProps {
  asset: TokenizedAssetData
}

export function MarketInfoBar({ asset }: MarketInfoBarProps) {
  const { assetTwo, market } = useAssetDetail()
  const router = useRouter()
  const isPositive = asset.dailyChange >= 0
  const quoteSymbol = assetTwo?.symbol ?? asset.quoteAssetSymbol ?? '$'

  const formatPrice = (price: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price)
  }

  const { high24h, low24h, volume24h } = useMemo(() => {
    if (!asset.timeHistoryData || asset.timeHistoryData.length === 0) {
      return { high24h: 0, low24h: 0, volume24h: 0 }
    }

    const now = Date.now() / 1000
    const dayAgo = now - 86400
    const recentData = asset.timeHistoryData.filter(d => d.timestamp >= dayAgo)
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
      flexShrink={0}
      h="48px"
      px={2}
      spacing={0}
      w="full"
    >
      {/* Back button */}
      <IconButton
        aria-label="Back to markets"
        icon={<ArrowLeft size={16} />}
        mr={1}
        onClick={() => router.push('/trade')}
        size="sm"
        variant="ghost"
      />

      {/* Market pair with icon */}
      <HStack minW="140px" spacing={2}>
        <Image
          alt={asset.name}
          borderRadius="full"
          boxSize="20px"
          fallback={
            <Box
              alignItems="center"
              bg="gray.600"
              borderRadius="full"
              boxSize="20px"
              display="flex"
              fontSize="2xs"
              fontWeight="bold"
              justifyContent="center"
            >
              {asset.symbol.charAt(0)}
            </Box>
          }
          src={asset.logo}
        />
        <Text fontSize="sm" fontWeight="bold">
          {pairName}
        </Text>
      </HStack>

      <Divider h="28px" orientation="vertical" />

      {/* Last price */}
      <Box px={3}>
        <Text
          color={isPositive ? 'green.400' : 'red.400'}
          fontFamily="mono"
          fontSize="md"
          fontWeight="bold"
        >
          {formatPrice(asset.currentPrice, 4)}
        </Text>
      </Box>

      <Divider h="28px" orientation="vertical" />

      {/* 24h Change */}
      <Tooltip hasArrow label="Price change in last 24 hours" placement="bottom">
        <Box px={3}>
          <Text color="font.secondary" fontSize="2xs" lineHeight="1">
            24h Change
          </Text>
          <Text
            color={isPositive ? 'green.400' : 'red.400'}
            fontFamily="mono"
            fontSize="xs"
            fontWeight="medium"
          >
            {isPositive ? '+' : ''}
            {asset.dailyChangePercent.toFixed(2)}%
          </Text>
        </Box>
      </Tooltip>

      <Divider display={{ base: 'none', xl: 'block' }} h="28px" orientation="vertical" />

      {/* 24h High — hide on smaller screens */}
      <Tooltip hasArrow label="Highest price in last 24 hours" placement="bottom">
        <Box display={{ base: 'none', xl: 'block' }} px={3}>
          <Text color="font.secondary" fontSize="2xs" lineHeight="1">
            24h High
          </Text>
          <Text fontFamily="mono" fontSize="xs" fontWeight="medium">
            {high24h > 0 ? formatPrice(high24h, 4) : '--'}
          </Text>
        </Box>
      </Tooltip>

      <Divider display={{ base: 'none', xl: 'block' }} h="28px" orientation="vertical" />

      {/* 24h Low — hide on smaller screens */}
      <Tooltip hasArrow label="Lowest price in last 24 hours" placement="bottom">
        <Box display={{ base: 'none', xl: 'block' }} px={3}>
          <Text color="font.secondary" fontSize="2xs" lineHeight="1">
            24h Low
          </Text>
          <Text fontFamily="mono" fontSize="xs" fontWeight="medium">
            {low24h > 0 ? formatPrice(low24h, 4) : '--'}
          </Text>
        </Box>
      </Tooltip>

      <Divider display={{ base: 'none', xl: 'block' }} h="28px" orientation="vertical" />

      {/* 24h Volume — hide on smaller screens */}
      <Tooltip hasArrow label="Total trading volume in last 24 hours" placement="bottom">
        <Box display={{ base: 'none', xl: 'block' }} px={3}>
          <Text color="font.secondary" fontSize="2xs" lineHeight="1">
            24h Volume
          </Text>
          <Text fontFamily="mono" fontSize="xs" fontWeight="medium">
            {volume24h > 0 ? formatVolume(volume24h) : '--'}
          </Text>
        </Box>
      </Tooltip>
    </HStack>
  )
}
