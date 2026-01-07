'use client'

import {
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  Image,
  Progress,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import type {
  CradleNativeListingRow,
  ListingStats,
} from '@repo/lib/cradle-client-ts/cradle-api-client'
import { fromTokenDecimals } from '@repo/lib/modules/lend/utils'

export interface ListingData extends CradleNativeListingRow {
  assetName?: string
  assetSymbol?: string
  assetIcon?: string | null
  purchaseAssetSymbol?: string
  purchaseAssetDecimals?: number
  /**
   * Decimals for the listed token itself (used for supply metrics)
   */
  assetDecimals?: number
  stats?: ListingStats
}

interface ListingCardProps {
  listing: ListingData
  onClick?: () => void
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const fallbackBg = useColorModeValue('gray.200', 'gray.600')
  const fallbackColor = useColorModeValue('gray.700', 'gray.200')

  // Status color based on listing status
  const isOpen = listing.status === 'open'
  const statusColor = useColorModeValue(
    isOpen ? 'green.500' : 'gray.500',
    isOpen ? 'green.400' : 'gray.400'
  )
  const statusBgColor = useColorModeValue(
    isOpen ? 'green.50' : 'gray.100',
    isOpen ? 'green.900' : 'gray.700'
  )

  const statusColorMap: Record<string, string> = {
    open: 'green',
    pending: 'yellow',
    closed: 'gray',
    paused: 'orange',
    cancelled: 'red',
  }

  // Convert from token decimals and format as currency
  const formatPrice = (price: string) => {
    const numPrice = fromTokenDecimals(parseFloat(price), listing.purchaseAssetDecimals ?? 6)
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice)
    const symbol = listing.purchaseAssetSymbol ?? '$'
    const separator = symbol === '$' ? '' : ' '
    return `${symbol}${separator}${formatted}`
  }

  // Convert from listed asset decimals and format as compact number
  const formatSupply = (supply: string | number) => {
    const numSupply = typeof supply === 'string' ? parseFloat(supply) : supply
    const normalizedSupply = fromTokenDecimals(numSupply, listing.assetDecimals ?? 6)
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(normalizedSupply)
  }

  // Calculate progress percentage (both values are in same decimal format, so no conversion needed for ratio)
  const totalDistributed = listing.stats?.total_distributed
    ? Number(listing.stats.total_distributed)
    : 0
  const maxSupply = parseFloat(listing.max_supply)
  const progressPercent = maxSupply > 0 ? (totalDistributed / maxSupply) * 100 : 0

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
          {/* 1. Header - Logo, Symbol, Name (matches TokenizedAssetCard) */}
          <HStack align="start" spacing={3}>
            <Box borderRadius="md" flexShrink={0} h={10} overflow="hidden" w={10}>
              {listing.assetIcon ? (
                <Image
                  alt={`${listing.assetName} logo`}
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
                        {listing.assetSymbol?.charAt(0).toUpperCase() ||
                          listing.name.charAt(0).toUpperCase()}
                      </Text>
                    </Box>
                  }
                  h="full"
                  objectFit="contain"
                  src={listing.assetIcon}
                  w="full"
                />
              ) : (
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
                    {listing.assetSymbol?.charAt(0).toUpperCase() ||
                      listing.name.charAt(0).toUpperCase()}
                  </Text>
                </Box>
              )}
            </Box>
            <VStack align="start" flex={1} spacing={0}>
              {/* Ticker symbol - bold */}
              <Text fontSize="lg" fontWeight="bold" lineHeight="1.2">
                {listing.assetSymbol || listing.name}
              </Text>
              {/* Asset name - smaller and lighter */}
              <Text color="font.secondary" fontSize="sm" lineHeight="1.2" noOfLines={1}>
                {listing.assetName || listing.name}
              </Text>
            </VStack>
          </HStack>

          {/* 2. Price Info - Left aligned under header (matches TokenizedAssetCard) */}
          <VStack align="start" spacing={2}>
            {/* Current price - large, bold */}
            <Text fontSize="2xl" fontWeight="bold">
              {formatPrice(listing.purchase_price)}
            </Text>
            {/* Status and supply info */}
            <HStack spacing={2}>
              <Badge
                colorScheme={statusColorMap[listing.status] || 'gray'}
                fontSize="xs"
                px={2}
                py={0.5}
                textTransform="capitalize"
              >
                {listing.status}
              </Badge>
              <Text color="font.secondary" fontSize="sm">
                •
              </Text>
              <Text color="font.secondary" fontSize="sm">
                {(() => {
                  const formatted = formatSupply(listing.max_supply)
                  console.log('Max supply:', {
                    raw: listing.max_supply,
                    formatted,
                    assetDecimals: listing.assetDecimals,
                  })
                  return `${formatted} max supply`
                })()}
              </Text>
            </HStack>
          </VStack>

          {/* 3. Progress Bar Area (similar to chart area in TokenizedAssetCard) */}
          <Box bg={statusBgColor} borderRadius="md" overflow="hidden" p={3} w="full">
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text color={statusColor} fontSize="sm" fontWeight="medium">
                  {progressPercent.toFixed(1)}% sold
                </Text>
                <Text color="font.secondary" fontSize="sm">
                  {formatSupply(totalDistributed)} / {formatSupply(maxSupply)}
                </Text>
              </HStack>
              <Progress
                borderRadius="full"
                colorScheme={statusColorMap[listing.status] || 'gray'}
                h={2}
                value={progressPercent}
              />
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
