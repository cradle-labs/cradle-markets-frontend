'use client'

import { Grid, Skeleton, VStack, Text, Heading } from '@chakra-ui/react'
import { ListingCard, ListingData } from './ListingCard'

interface ListingGridProps {
  listings: ListingData[]
  loading?: boolean
  onListingClick?: (listing: ListingData) => void
}

export function ListingGrid({ listings, loading = false, onListingClick }: ListingGridProps) {
  if (loading) {
    return (
      <Grid
        gap={5}
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton borderRadius="xl" h={280} key={index} />
        ))}
      </Grid>
    )
  }

  if (listings.length === 0) {
    return (
      <VStack py={12} spacing={4}>
        <Heading color="font.secondary" size="md">
          No listings available
        </Heading>
        <Text color="font.tertiary">Check back later for new investment opportunities</Text>
      </VStack>
    )
  }

  return (
    <Grid
      gap={5}
      templateColumns={{
        base: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)',
      }}
    >
      {listings.map(listing => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onClick={onListingClick ? () => onListingClick(listing) : undefined}
        />
      ))}
    </Grid>
  )
}
