'use client'

import {
  Badge,
  Box,
  HStack,
  Image,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { ListingData } from './ListingCard'
import { fromTokenDecimals } from '@repo/lib/modules/lend/utils'

interface ListingTableProps {
  listings: ListingData[]
  loading?: boolean
  onListingClick?: (listing: ListingData) => void
}

export function ListingTable({ listings, loading = false, onListingClick }: ListingTableProps) {
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const fallbackBg = useColorModeValue('gray.200', 'gray.600')
  const fallbackColor = useColorModeValue('gray.700', 'gray.200')

  const statusColorMap: Record<string, string> = {
    open: 'green',
    pending: 'yellow',
    closed: 'gray',
    paused: 'orange',
    cancelled: 'red',
  }

  // Convert from 8 decimals and format as currency
  const formatPrice = (price: string) => {
    const numPrice = fromTokenDecimals(parseFloat(price))
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice)
  }

  // Convert from 8 decimals and format as compact number
  const formatSupply = (supply: string) => {
    const numSupply = fromTokenDecimals(parseFloat(supply))
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(numSupply)
  }

  if (loading) {
    return (
      <VStack spacing={3} w="full">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton borderRadius="md" h={16} key={index} w="full" />
        ))}
      </VStack>
    )
  }

  if (listings.length === 0) {
    return (
      <VStack py={12} spacing={4}>
        <Text color="font.secondary" fontSize="lg" fontWeight="medium">
          No listings available
        </Text>
        <Text color="font.tertiary">Check back later for new investment opportunities</Text>
      </VStack>
    )
  }

  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Asset</Th>
            <Th>Description</Th>
            <Th isNumeric>Price</Th>
            <Th isNumeric>Max Supply</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {listings.map(listing => (
            <Tr
              _hover={onListingClick ? { bg: hoverBg, cursor: 'pointer' } : {}}
              key={listing.id}
              onClick={onListingClick ? () => onListingClick(listing) : undefined}
              transition="background 0.2s ease"
            >
              <Td>
                <HStack spacing={3}>
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
                            <Text color={fallbackColor} fontSize="sm" fontWeight="bold">
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
                        <Text color={fallbackColor} fontSize="sm" fontWeight="bold">
                          {listing.assetSymbol?.charAt(0).toUpperCase() ||
                            listing.name.charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{listing.assetSymbol || listing.name}</Text>
                    <Text color="font.secondary" fontSize="sm">
                      {listing.assetName || listing.name}
                    </Text>
                  </VStack>
                </HStack>
              </Td>
              <Td>
                <Text color="font.secondary" maxW={300} noOfLines={2}>
                  {listing.description}
                </Text>
              </Td>
              <Td isNumeric>
                <Text fontWeight="bold">{formatPrice(listing.purchase_price)}</Text>
                {listing.purchaseAssetSymbol && (
                  <Text color="font.secondary" fontSize="sm">
                    {listing.purchaseAssetSymbol}
                  </Text>
                )}
              </Td>
              <Td isNumeric>
                <Text>{formatSupply(listing.max_supply)}</Text>
              </Td>
              <Td>
                <Badge colorScheme={statusColorMap[listing.status] || 'gray'}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
