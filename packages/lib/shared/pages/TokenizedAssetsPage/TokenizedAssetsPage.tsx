'use client'

import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { 
  TokenizedAssetGrid, 
  TokenizedAssetProvider, 
  useTokenizedAssets, 
  TokenizedAssetData,
  TokenizedAssetTable
} from '@repo/lib/modules/trade/TokenizedAssets'
import { useRouter } from 'next/navigation'
import { AssetSearchFilters, AssetCategory, ViewMode, SortOption } from '@repo/lib/modules/trade/components'
import { PropsWithChildren, useState, useMemo } from 'react'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'

interface TokenizedAssetsContentProps {
  onAssetClick?: (asset: TokenizedAssetData) => void
}

function TokenizedAssetsContent({ onAssetClick }: TokenizedAssetsContentProps) {
  const { assets, loading, error } = useTokenizedAssets()
  const router = useRouter()
  
  // State for search and filters
  const [search, setSearch] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('most-popular')

  // Handle asset click navigation
  const handleAssetClick = (asset: TokenizedAssetData) => {
    if (onAssetClick) {
      onAssetClick(asset)
    } else {
      // Default navigation to asset detail page
      router.push(`/trade/${asset.id}`)
    }
  }

  // Filter and search assets
  const filteredAssets = useMemo(() => {
    let filtered = assets

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchLower) ||
          asset.symbol.toLowerCase().includes(searchLower)
      )
    }

    // Apply category filter (mock implementation)
    if (selectedCategory !== 'all') {
      // In a real app, assets would have category metadata
      filtered = filtered.filter((asset) => {
        // Simple mock categorization for NSE stocks
        if (selectedCategory === 'technology') {
          return ['Safaricom'].some(name => 
            asset.name.toLowerCase().includes(name.toLowerCase())
          )
        }
        if (selectedCategory === 'financials') {
          return ['Equity Bank', 'KCB', 'Co-operative Bank', 'NCBA', 'Standard Chartered'].some(name => 
            asset.name.toLowerCase().includes(name.toLowerCase())
          )
        }
        if (selectedCategory === 'consumer') {
          return ['EABL', 'BAT', 'Bamburi', 'Crown Paints'].some(name => 
            asset.name.toLowerCase().includes(name.toLowerCase())
          )
        }
        
        return true
      })
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.currentPrice - b.currentPrice)
        break
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.currentPrice - a.currentPrice)
        break
      case 'change-asc':
        filtered = [...filtered].sort((a, b) => a.dailyChangePercent - b.dailyChangePercent)
        break
      case 'change-desc':
        filtered = [...filtered].sort((a, b) => b.dailyChangePercent - a.dailyChangePercent)
        break
      case 'volume-asc':
      case 'volume-desc':
        // Mock volume sorting - in real app, volume would be part of asset data
        filtered = [...filtered].sort(() => {
          const volumeA = Math.random() * 1000000
          const volumeB = Math.random() * 1000000
          return sortBy === 'volume-asc' ? volumeA - volumeB : volumeB - volumeA
        })
        break
      default:
        // Most popular - keep original order
        break
    }

    return filtered
  }, [assets, search, selectedCategory, sortBy])

  if (error) {
    return (
      <VStack py={8} spacing={4}>
        <Heading color="red.500" size="md">
          Error loading tokenized assets
        </Heading>
        <Text color="font.secondary">{error}</Text>
      </VStack>
    )
  }

  return (
    <VStack align="stretch" spacing={6}>
      {/* Search and Filters */}
      <AssetSearchFilters
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
        <TokenizedAssetGrid 
          assets={filteredAssets} 
          loading={loading} 
          onAssetClick={handleAssetClick} 
        />
      ) : (
        <TokenizedAssetTable 
          assets={filteredAssets} 
          loading={loading} 
          onAssetClick={handleAssetClick} 
        />
      )}
    </VStack>
  )
}

type TokenizedAssetsPageProps = PropsWithChildren & {
  onAssetClick?: (asset: TokenizedAssetData) => void
}

export function TokenizedAssetsPage({ children, onAssetClick }: TokenizedAssetsPageProps) {
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
                    Explore Assets
                  </Heading>
                  <Text sx={{ textWrap: 'balance' }} variant="secondary">
                    Discover and trade tokenized real-world assets with real-time pricing and 24/7 availability.
                  </Text>
                </Box>
              </VStack>
            </FadeInOnView>
            <FadeInOnView animateOnce={false}>
              <Box pb={{ base: '0', md: '3' }}>
                {children}
              </Box>
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
          <TokenizedAssetProvider>
            <TokenizedAssetsContent onAssetClick={onAssetClick} />
          </TokenizedAssetProvider>
        </FadeInOnView>
      </DefaultPageContainer>
    </>
  )
}
