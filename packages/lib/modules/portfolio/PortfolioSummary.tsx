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
}

function AssetCard({ asset }: AssetCardProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  const fallbackBg = useColorModeValue('background.level2', 'background.level2')
  const fallbackColor = useColorModeValue('font.secondary', 'font.secondary')
  const valueColor = useColorModeValue('font.secondary', 'font.secondary')

  const displayBalance = asset.isLoading ? (
    <Spinner size="xs" />
  ) : (
    `${asset.formatted} ${asset.symbol}`
  )
  const displayValue = `$${(asset.value || 0).toFixed(2)}`

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
            <Text color={valueColor} fontSize="xs" fontWeight="medium">
              {displayValue}
            </Text>
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

  // Create a map of token -> balance from API balances
  const balanceMap = React.useMemo(() => {
    if (!apiBalances) return new Map<string, string>()
    const map = new Map<string, string>()
    apiBalances.forEach(({ token, balance }) => {
      map.set(token, balance)
    })
    return map
  }, [apiBalances])

  // Group assets by type
  const nativeAssets = assets?.filter(asset => asset.asset_type === 'native') || []
  // Filter for yield_bearing assets
  const yieldAssets = assets?.filter(asset => asset.asset_type === 'yield_bearing') || []
  const bridgedAssets = assets?.filter(asset => asset.asset_type === 'bridged') || []
  const stableAssets = assets?.filter(asset => asset.asset_type === 'stablecoin') || []

  // Combine bridged assets with native assets for display
  const tokenizedAssets = [...bridgedAssets, ...nativeAssets]

  // Helper function to format balance from Big number string with commas
  const formatBalance = (balance: string, decimals: number): string => {
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

      // Use the existing number formatting utility for comma separation
      return fNum('token', rawValue, { abbreviated: false })
    } catch {
      return '0'
    }
  }

  // Map assets to AssetBalance format
  const mapToAssetBalance = (asset: Asset): AssetBalance => {
    // Get balance from API balances (by token ID)
    const apiBalance = asset.token ? balanceMap.get(asset.token) : undefined

    // Use API balance or default to '0'
    const balance = apiBalance || '0'
    const formatted = apiBalance ? formatBalance(apiBalance, asset.decimals) : '0'
    const isLoading = isLoadingBalances || false

    return {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      icon: asset.icon || '',
      balance,
      formatted,
      isLoading,
      value: 0, // TODO: Add price data to calculate USD value
    }
  }

  // Only show assets with confirmed non-zero balances (no loading assets)
  const stableAssetBalances = stableAssets.map(mapToAssetBalance).filter(asset => {
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
      const mappedAsset = mapToAssetBalance(asset)
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
                    <AssetCard asset={asset} key={asset.id} />
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
