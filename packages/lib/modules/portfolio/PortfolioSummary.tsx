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
import type { Asset } from '@repo/lib/cradle-client-ts/cradle-api-client'
import { useTokenBalances } from '@repo/lib/shared/hooks/useTokenBalances'

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
  walletAddress: string | undefined
  assets: Asset[] | undefined
  isLoadingAssets: boolean
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
    `${parseFloat(asset.formatted).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })} ${asset.symbol}`
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

const PortfolioSummary = ({ walletAddress, assets, isLoadingAssets }: PortfolioSummaryProps) => {
  // Fetch balances for all assets
  const { balances } = useTokenBalances({
    walletAddress,
    assets,
    enabled: !!walletAddress && !!assets && assets.length > 0,
  })

  // Group assets by type
  const nativeAssets = assets?.filter(asset => asset.asset_type === 'native') || []
  // Handle both yield_bearing and yield_breaking types (API inconsistency)
  const yieldAssets =
    assets?.filter(
      asset =>
        asset.asset_type === 'yield_breaking' || (asset.asset_type as string).includes('yield')
    ) || []
  const bridgedAssets = assets?.filter(asset => asset.asset_type === 'bridged') || []

  // Combine bridged assets with native assets for display
  const tokenizedAssets = [...bridgedAssets, ...nativeAssets]

  // Map assets to AssetBalance format
  const mapToAssetBalance = (asset: Asset): AssetBalance => {
    const balance = balances[asset.id]
    return {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      icon: asset.icon || '',
      balance: balance?.balance || '0',
      formatted: balance?.formatted || '0',
      isLoading: balance?.isLoading || false,
      value: 0, // TODO: Add price data to calculate USD value
    }
  }

  const tokenizedAssetBalances = tokenizedAssets.map(mapToAssetBalance)
  const yieldAssetBalances = yieldAssets.map(mapToAssetBalance)

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
        {/* Tokenized Assets Column */}
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
              Tokenized Assets
            </Text>
            {tokenizedAssetBalances.length > 0 ? (
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
            {yieldAssetBalances.length > 0 ? (
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
