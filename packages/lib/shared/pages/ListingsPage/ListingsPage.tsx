'use client'

import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import {
  ListingGrid,
  ListingTable,
  ListingProvider,
  useListingsContext,
  ListingData,
  ListingSearchFilters,
  ViewMode,
  ListingCategory,
  SortOption,
} from '@repo/lib/modules/listings'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useState, useMemo } from 'react'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import type { ListingStatus } from '@repo/lib/cradle-client-ts/types'

interface ListingsContentProps {
  onListingClick?: (listing: ListingData) => void
}

function ListingsContent({ onListingClick }: ListingsContentProps) {
  const { listings, loading, error } = useListingsContext()
  const router = useRouter()

  // State for search and filters
  const [search, setSearch] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('most-popular')

  // Handle listing click navigation
  const handleListingClick = (listing: ListingData) => {
    if (onListingClick) {
      onListingClick(listing)
    } else {
      router.push(`/listings/${listing.id}`)
    }
  }

  // Filter and search listings
  const filteredListings = useMemo(() => {
    let filtered = listings

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        listing =>
          listing.name.toLowerCase().includes(searchLower) ||
          listing.assetSymbol?.toLowerCase().includes(searchLower) ||
          listing.assetName?.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply category/status filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.status === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort(
          (a, b) => parseFloat(a.purchase_price) - parseFloat(b.purchase_price)
        )
        break
      case 'price-desc':
        filtered = [...filtered].sort(
          (a, b) => parseFloat(b.purchase_price) - parseFloat(a.purchase_price)
        )
        break
      case 'supply-asc':
        filtered = [...filtered].sort((a, b) => parseFloat(a.max_supply) - parseFloat(b.max_supply))
        break
      case 'supply-desc':
        filtered = [...filtered].sort((a, b) => parseFloat(b.max_supply) - parseFloat(a.max_supply))
        break
      case 'newest':
        filtered = [...filtered].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      default:
        // Most popular - keep original order
        break
    }

    return filtered
  }, [listings, search, selectedCategory, sortBy])

  if (error) {
    return (
      <VStack py={8} spacing={4}>
        <Heading color="red.500" size="md">
          Error loading listings
        </Heading>
        <Text color="font.secondary">{error}</Text>
      </VStack>
    )
  }

  return (
    <VStack align="stretch" spacing={6}>
      {/* Search and Filters */}
      <ListingSearchFilters
        isLoading={loading}
        search={search}
        selectedCategory={selectedCategory}
        setSearch={setSearch}
        setSelectedCategory={setSelectedCategory}
        setSortBy={setSortBy}
        setViewMode={setViewMode}
        sortBy={sortBy}
        viewMode={viewMode}
      />

      {/* Content based on view mode */}
      {viewMode === 'grid' ? (
        <ListingGrid
          listings={filteredListings}
          loading={loading}
          onListingClick={handleListingClick}
        />
      ) : (
        <ListingTable
          listings={filteredListings}
          loading={loading}
          onListingClick={handleListingClick}
        />
      )}
    </VStack>
  )
}

type ListingsPageProps = PropsWithChildren & {
  onListingClick?: (listing: ListingData) => void
  statusFilter?: ListingStatus
}

export function ListingsPage({ children, onListingClick, statusFilter }: ListingsPageProps) {
  return (
    <>
      <Box borderBottom="1px solid" borderColor="border.base">
        <Noise
          backgroundColor="background.level0WithOpacity"
          overflow="hidden"
          position="relative"
          shadow="innerBase"
        >
          <DefaultPageContainer
            pb={['xl', 'xl', '10']}
            pr={{ base: '0 !important', md: 'md !important' }}
            pt={['xl', '40px']}
          >
            <Box display={{ base: 'none', md: 'block' }}>
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                padding="15px"
                position="absolute"
                right={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                top="40px"
                width={1000}
              />
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                left={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                padding="15px"
                position="absolute"
                top="40px"
                width={1000}
              />
            </Box>
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="-300px"
              width={600}
            />
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="300px"
              width={600}
            />
            <FadeInOnView animateOnce={false}>
              <VStack
                align={{ base: 'start', md: 'start' }}
                gap="4"
                justify={{ base: 'start', md: 'space-between' }}
                mb="10"
              >
                <Box>
                  <Heading pb="3" sx={{ textWrap: 'balance' }} variant="special">
                    Token Listings
                  </Heading>
                  <Text maxW="2xl" sx={{ textWrap: 'balance' }} variant="secondary">
                    Invest in early-stage startups through compliant on-chain offerings. Each
                    listing provides investor protections equivalent to traditional securities while
                    unlocking the benefits of tokenized ownership.
                  </Text>
                </Box>
              </VStack>
            </FadeInOnView>
            <FadeInOnView animateOnce={false}>
              <Box pb={{ base: '0', md: '3' }}>{children}</Box>
            </FadeInOnView>
          </DefaultPageContainer>
        </Noise>
      </Box>
      <DefaultPageContainer
        noVerticalPadding
        pb="xl"
        pr={{ base: '0 !important', xl: 'md !important' }}
        pt={['lg', '54px']}
      >
        <FadeInOnView animateOnce={false}>
          <ListingProvider statusFilter={statusFilter}>
            <ListingsContent onListingClick={onListingClick} />
          </ListingProvider>
        </FadeInOnView>
      </DefaultPageContainer>
    </>
  )
}
