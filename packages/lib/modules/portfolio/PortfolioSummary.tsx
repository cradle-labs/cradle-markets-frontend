'use client'

import React from 'react'
import {
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  Skeleton,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import { Asset } from '@repo/lib/cradle-client-ts/types'
import { fNum } from '@repo/lib/shared/utils/numbers'
import { useTokenizedAssets } from '@repo/lib/modules/trade/TokenizedAssets'

// Types for asset balances
interface AssetBalance {
  id: string
  name: string
  symbol: string
  icon: string
  balance: string
  formatted: string
  isLoading: boolean
  value?: number // USD value
}

interface PortfolioSummaryProps {
  assets: Asset[] | undefined
  isLoadingAssets: boolean
  balances?: Array<{ token: string; balance: string }> | undefined
  isLoadingBalances?: boolean
}

interface AssetCardProps {
  asset: AssetBalance
  showValue?: boolean
}

function AssetCard({ asset, showValue = true }: AssetCardProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  const fallbackBg = useColorModeValue('background.level2', 'background.level2')
  const fallbackColor = useColorModeValue('font.secondary', 'font.secondary')

  const displayBalance = asset.isLoading ? (
    <Spinner size="xs" />
  ) : (
    `${asset.formatted} ${asset.symbol}`
  )

  return (
    <HStack
      _hover={{
        transform: 'translateY(-2px)',
      }}
      align="center"
      bg={cardBg}
      borderRadius="lg"
      justify="space-between"
      p={4}
      shadow="xl"
      spacing={3}
      transition="all 0.2s"
      w="full"
    >
      {/* Icon */}
      <Box borderRadius="full" flexShrink={0} h={10} overflow="hidden" w={10}>
        {asset.icon ? (
          <Image
            alt={`${asset.name} logo`}
            fallback={
              <Box
                alignItems="center"
                bg={fallbackBg}
                borderRadius="full"
                display="flex"
                h="full"
                justifyContent="center"
                w="full"
              >
                <Text color={fallbackColor} fontSize="lg" fontWeight="bold">
                  {asset.symbol.charAt(0).toUpperCase()}
                </Text>
              </Box>
            }
            h="full"
            objectFit="contain"
            src={asset.icon}
            w="full"
          />
        ) : (
          <Box
            alignItems="center"
            bg={fallbackBg}
            borderRadius="full"
            display="flex"
            h="full"
            justifyContent="center"
            w="full"
          >
            <Text color={fallbackColor} fontSize="lg" fontWeight="bold">
              {asset.symbol.charAt(0).toUpperCase()}
            </Text>
          </Box>
        )}
      </Box>

      {/* Name */}
      <Text flex={1} fontSize="md" fontWeight="medium">
        {asset.name}
      </Text>

      {/* Balance and Dollar Value */}
      <VStack align="end" spacing={0}>
        {asset.isLoading ? (
          <Skeleton h="20px" w="80px" />
        ) : (
          <>
            <Text fontSize="sm" fontWeight="semibold">
              {displayBalance}
            </Text>
            {showValue && asset.value !== undefined && asset.value > 0 && (
              <Text color="font.secondary" fontSize="xs">
                {fNum('fiat', asset.value, { abbreviated: false })} KESN
              </Text>
            )}
          </>
        )}
      </VStack>
    </HStack>
  )
}

const PortfolioSummary = ({
  assets,
  isLoadingAssets,
  balances: apiBalances,
  isLoadingBalances,
}: PortfolioSummaryProps) => {
  // Note: Now using useAssetBalances from Portfolio component instead of Hedera fallback

  // Get tokenized assets with prices from time series
  let tokenizedAssetsData: {
    assets: Array<{ symbol: string; name: string; currentPrice: number }>
    loading: boolean
  } = { assets: [], loading: false }
  try {
    const tokenizedAssets = useTokenizedAssets()
    tokenizedAssetsData = {
      assets: tokenizedAssets.assets.map(asset => ({
        symbol: asset.symbol,
        name: asset.name,
        currentPrice: asset.currentPrice,
      })),
      loading: tokenizedAssets.loading,
    }
  } catch {
    // TokenizedAssetProvider not available, continue without prices
    console.warn('TokenizedAssetProvider not available, dollar values will not be displayed')
  }

  // Create a map of token -> balance from API balances
  const balanceMap = React.useMemo(() => {
    if (!apiBalances) return new Map<string, string>()
    const map = new Map<string, string>()
    apiBalances.forEach(({ token, balance }) => {
      map.set(token, balance)
    })
    return map
  }, [apiBalances])

  // Helper to filter out shadow assets (not relevant on frontend)
  const isNotShadowAsset = (asset: Asset) => {
    const name = asset.name?.toLowerCase() || ''
    const symbol = asset.symbol?.toLowerCase() || ''
    return !name.includes('shadow') && !symbol.includes('shadow')
  }

  // Group assets by type (excluding shadow assets)
  const nativeAssets =
    assets?.filter(asset => asset.asset_type === 'native' && isNotShadowAsset(asset)) || []
  // Filter for yield_bearing assets
  const yieldAssets =
    assets?.filter(asset => asset.asset_type === 'yield_bearing' && isNotShadowAsset(asset)) || []
  const bridgedAssets =
    assets?.filter(asset => asset.asset_type === 'bridged' && isNotShadowAsset(asset)) || []
  const stableAssets =
    assets?.filter(asset => asset.asset_type === 'stablecoin' && isNotShadowAsset(asset)) || []

  // Combine bridged assets with native assets for display
  const tokenizedAssets = [...bridgedAssets, ...nativeAssets]

  // Helper function to format balance from Big number string with commas
  const formatBalance = (balance: string, decimals: number, decimalPlaces?: number): string => {
    try {
      const balanceBigInt = BigInt(balance)
      const divisor = BigInt(10 ** decimals)
      const wholePart = balanceBigInt / divisor
      const fractionalPart = balanceBigInt % divisor

      let rawValue: string
      if (fractionalPart === BigInt(0)) {
        rawValue = wholePart.toString()
      } else {
        const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
        const trimmedFractional = fractionalStr.replace(/0+$/, '')
        rawValue = `${wholePart}.${trimmedFractional}`
      }

      // If decimalPlaces is specified, format to that precision
      if (decimalPlaces !== undefined) {
        const numValue = parseFloat(rawValue)
        return fNum('token', numValue.toFixed(decimalPlaces), { abbreviated: false })
      }

      // Use the existing number formatting utility for comma separation
      return fNum('token', rawValue, { abbreviated: false })
    } catch {
      return '0'
    }
  }

  // Map assets to AssetBalance format
  const mapToAssetBalance = (asset: Asset, decimalPlaces?: number): AssetBalance => {
    // Get balance from API balances (by token ID)
    const apiBalance = asset.token ? balanceMap.get(asset.token) : undefined

    // Use API balance or default to '0'
    const balance = apiBalance || '0'
    const formatted = apiBalance ? formatBalance(apiBalance, asset.decimals, decimalPlaces) : '0'
    const isLoading = isLoadingBalances || false

    // Calculate USD value from time series data for tokenized assets
    let usdValue = 0
    if (apiBalance && BigInt(apiBalance) > BigInt(0)) {
      // Find matching tokenized asset by symbol or name
      const priceMatchBySymbol = tokenizedAssetsData.assets.find(
        ta => ta.symbol.toLowerCase() === asset.symbol?.toLowerCase()
      )
      const priceMatchByName = tokenizedAssetsData.assets.find(
        ta => ta.name.toLowerCase() === asset.name?.toLowerCase()
      )

      const currentPrice = priceMatchBySymbol?.currentPrice ?? priceMatchByName?.currentPrice ?? 0

      if (currentPrice > 0) {
        // Convert balance to normalized value and multiply by price
        try {
          const balanceBigInt = BigInt(apiBalance)
          const divisor = BigInt(10 ** asset.decimals)
          const wholePart = balanceBigInt / divisor
          const fractionalPart = balanceBigInt % divisor
          const normalizedBalance = Number(wholePart) + Number(fractionalPart) / Number(divisor)
          usdValue = normalizedBalance * currentPrice
        } catch {
          usdValue = 0
        }
      }
    }

    return {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      icon: asset.icon || '',
      balance,
      formatted,
      isLoading,
      value: usdValue,
    }
  }

  // Only show assets with confirmed non-zero balances (no loading assets)
  const stableAssetBalances = stableAssets
    .map(asset => mapToAssetBalance(asset, 2))
    .filter(asset => {
      // Only show assets that are not loading and have non-zero balance
      if (asset.isLoading) return false
      return BigInt(asset.balance || '0') > BigInt(0)
    })

  const tokenizedAssetBalances = tokenizedAssets.map(mapToAssetBalance).filter(asset => {
    // Only show assets that are not loading and have non-zero balance
    if (asset.isLoading) return false
    return BigInt(asset.balance || '0') > BigInt(0)
  })

  const yieldAssetBalances = yieldAssets.map(mapToAssetBalance).filter(asset => {
    // Only show assets that are not loading and have non-zero balance
    if (asset.isLoading) return false
    return BigInt(asset.balance || '0') > BigInt(0)
  })

  // Determine if we should show loading skeletons
  const isLoadingStableAssets =
    isLoadingBalances ||
    stableAssets.some(asset => {
      const mappedAsset = mapToAssetBalance(asset, 2)
      return mappedAsset.isLoading
    })

  const isLoadingTokenizedAssets =
    isLoadingBalances ||
    tokenizedAssets.some(asset => {
      const mappedAsset = mapToAssetBalance(asset)
      return mappedAsset.isLoading
    })

  const isLoadingYieldAssets =
    isLoadingBalances ||
    yieldAssets.some(asset => {
      const mappedAsset = mapToAssetBalance(asset)
      return mappedAsset.isLoading
    })

  // Show loading state
  if (isLoadingAssets) {
    return (
      <VStack align="start" spacing={6} w="full">
        <Heading
          background="font.special"
          backgroundClip="text"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
        >
          Asset Balances
        </Heading>
        <Grid gap={6} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} w="full">
          <Skeleton borderRadius="lg" h="300px" w="full" />
          <Skeleton borderRadius="lg" h="300px" w="full" />
        </Grid>
      </VStack>
    )
  }

  // Show empty state
  if (!assets || assets.length === 0) {
    return (
      <VStack align="start" spacing={6} w="full">
        <Heading
          background="font.special"
          backgroundClip="text"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
        >
          Asset Balances
        </Heading>
        <Text color="font.secondary" fontSize="sm">
          No assets found
        </Text>
      </VStack>
    )
  }

  return (
    <VStack align="start" spacing={6} w="full">
      {/* Title with gradient */}
      <Heading
        background="font.special"
        backgroundClip="text"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="semibold"
      >
        Asset Balances
      </Heading>

      {/* Two-column layout */}
      <Grid gap={6} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} w="full">
        {/* Stable & Tokenized Assets Column */}
        <NoisyCard
          cardProps={{
            borderRadius: 'lg',
          }}
          contentProps={{
            p: 6,
            position: 'relative',
          }}
          shadowContainerProps={{
            shadow: 'innerXl',
          }}
        >
          <VStack align="start" spacing={6} w="full">
            {/* Stable Assets Section */}
            <VStack align="start" spacing={4} w="full">
              <Text color="font.secondary" fontSize="sm" fontWeight="medium">
                Stable Assets
              </Text>
              {isLoadingStableAssets ? (
                <VStack spacing={3} w="full">
                  <Skeleton borderRadius="lg" h="60px" w="full" />
                </VStack>
              ) : stableAssetBalances.length > 0 ? (
                <VStack spacing={3} w="full">
                  {stableAssetBalances.map(asset => (
                    <AssetCard asset={asset} key={asset.id} showValue={false} />
                  ))}
                </VStack>
              ) : (
                <Text color="font.secondary" fontSize="xs">
                  No stable assets
                </Text>
              )}
            </VStack>

            {/* Tokenized Assets Section */}
            <VStack align="start" spacing={4} w="full">
              <Text color="font.secondary" fontSize="sm" fontWeight="medium">
                Tokenized Assets
              </Text>
              {isLoadingTokenizedAssets ? (
                <VStack spacing={3} w="full">
                  <Skeleton borderRadius="lg" h="60px" w="full" />
                  <Skeleton borderRadius="lg" h="60px" w="full" />
                </VStack>
              ) : tokenizedAssetBalances.length > 0 ? (
                <VStack spacing={3} w="full">
                  {tokenizedAssetBalances.map(asset => (
                    <AssetCard asset={asset} key={asset.id} />
                  ))}
                </VStack>
              ) : (
                <Text color="font.secondary" fontSize="xs">
                  No tokenized assets
                </Text>
              )}
            </VStack>
          </VStack>
        </NoisyCard>

        {/* Yield Assets Column */}
        <NoisyCard
          cardProps={{
            borderRadius: 'lg',
          }}
          contentProps={{
            p: 6,
            position: 'relative',
          }}
          shadowContainerProps={{
            shadow: 'innerXl',
          }}
        >
          <VStack align="start" spacing={4}>
            <Text color="font.secondary" fontSize="sm" fontWeight="medium">
              Yield Assets
            </Text>
            {isLoadingYieldAssets ? (
              <VStack spacing={3} w="full">
                <Skeleton borderRadius="lg" h="60px" w="full" />
                <Skeleton borderRadius="lg" h="60px" w="full" />
                <Skeleton borderRadius="lg" h="60px" w="full" />
              </VStack>
            ) : yieldAssetBalances.length > 0 ? (
              <VStack spacing={3} w="full">
                {yieldAssetBalances.map(asset => (
                  <AssetCard asset={asset} key={asset.id} />
                ))}
              </VStack>
            ) : (
              <Text color="font.secondary" fontSize="xs">
                No yield assets
              </Text>
            )}
          </VStack>
        </NoisyCard>
      </Grid>
    </VStack>
  )
}

export default PortfolioSummary
