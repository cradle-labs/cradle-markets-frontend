'use client'

import React from 'react'
import {
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'

// Types for asset balances
interface AssetBalance {
  id: string
  name: string
  symbol: string
  icon: string
  balance: number
  value?: number // USD value
}

// Mock data for demonstration - replace with actual API calls
const mockTokenizedAssets: AssetBalance[] = [
  {
    id: 'asset-safaricom',
    name: 'Safaricom',
    symbol: 'cSAF',
    icon: '/images/tokens/safaricom.svg',
    balance: 0,
    value: 0,
  },
  {
    id: 'asset-equity',
    name: 'Equity Bank',
    symbol: 'cEQTY',
    icon: '/images/tokens/equity.svg',
    balance: 0,
    value: 0,
  },
  {
    id: 'asset-kcb',
    name: 'KCB Group',
    symbol: 'cKCB',
    icon: '/images/tokens/kcb.svg',
    balance: 0,
    value: 0,
  },
]

const mockHederaNativeTokens: AssetBalance[] = [
  {
    id: 'hbar',
    name: 'Hedera',
    symbol: 'HBAR',
    icon: '/images/tokens/hbar.svg',
    balance: 0,
    value: 0,
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '/images/tokens/usdc.svg',
    balance: 0,
    value: 0,
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    icon: '/images/tokens/usdt.svg',
    balance: 0,
    value: 0,
  },
]

interface AssetCardProps {
  asset: AssetBalance
}

function AssetCard({ asset }: AssetCardProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  const fallbackBg = useColorModeValue('background.level2', 'background.level2')
  const fallbackColor = useColorModeValue('font.secondary', 'font.secondary')
  const valueColor = useColorModeValue('font.secondary', 'font.secondary')

  const displayBalance = `${asset.balance.toLocaleString()} ${asset.symbol}`
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
      </Box>

      {/* Name */}
      <Text flex={1} fontSize="md" fontWeight="medium">
        {asset.name}
      </Text>

      {/* Balance and Dollar Value */}
      <VStack align="end" spacing={0}>
        <Text fontSize="sm" fontWeight="semibold">
          {displayBalance}
        </Text>
        <Text color={valueColor} fontSize="xs" fontWeight="medium">
          {displayValue}
        </Text>
      </VStack>
    </HStack>
  )
}

const PortfolioSummary = () => {
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
            <VStack spacing={3} w="full">
              {mockTokenizedAssets.map(asset => (
                <AssetCard asset={asset} key={asset.id} />
              ))}
            </VStack>
          </VStack>
        </NoisyCard>

        {/* Hedera Native Tokens Column */}
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
              Hedera Native Tokens
            </Text>
            <VStack spacing={3} w="full">
              {mockHederaNativeTokens.map(asset => (
                <AssetCard asset={asset} key={asset.id} />
              ))}
            </VStack>
          </VStack>
        </NoisyCard>
      </Grid>
    </VStack>
  )
}

export default PortfolioSummary
