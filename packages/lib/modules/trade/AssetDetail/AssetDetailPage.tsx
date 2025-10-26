'use client'

import { Box, HStack, VStack } from '@chakra-ui/react'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import { AssetDetailProvider, useAssetDetail } from './AssetDetailProvider'
import { AssetDetailProviders } from './AssetDetailProviders'
import { AssetBreadcrumbs } from './AssetBreadcrumbs'
import { AssetHeader } from './AssetHeader'
import { AssetChart } from './AssetChart'
import { AssetTradingPanel } from './AssetTradingPanel'
import { AssetInfo } from './AssetInfo'

interface AssetDetailPageProps {
  assetId: string
}

function AssetDetailContent() {
  const { asset, loading, error } = useAssetDetail()

  if (loading) {
    return <AssetDetailSkeleton />
  }

  if (error || !asset) {
    return <AssetDetailError error={error} />
  }

  return (
    <>
      {/* Header Section with Breadcrumbs */}
      <Box borderBottom="1px solid" borderColor="border.base">
        <Noise
          backgroundColor="background.level0WithOpacity"
          overflow="hidden"
          position="relative"
          shadow="innerBase"
        >
          <DefaultPageContainer
            noVerticalPadding
            pb={['xl', 'xl', '10']}
            pr={{ base: '0 !important', md: 'md !important' }}
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
              <VStack align="start" pt="72px" w="full">
                <AssetBreadcrumbs />
                <AssetHeader asset={asset} />
              </VStack>
            </FadeInOnView>
          </DefaultPageContainer>
        </Noise>
      </Box>

      {/* Main Content Section */}
      <DefaultPageContainer noVerticalPadding pb="xl" pt={['lg', '40px']}>
        <HStack align="start" spacing={6} w="full">
          {/* Left Column - Chart and Info */}
          <VStack align="stretch" flex={2} minW="700px" spacing={6}>
            <AssetChart asset={asset} />
            <AssetInfo asset={asset} />
          </VStack>

          {/* Right Column - Trading Panel */}
          <Box flex={1} maxW="500px" minW="400px">
            <AssetTradingPanel asset={asset} />
          </Box>
        </HStack>
      </DefaultPageContainer>
    </>
  )
}

function AssetDetailSkeleton() {
  return (
    <VStack align="stretch" spacing={6}>
      <Box bg="background.level1" borderRadius="md" h="120px" />
      <HStack align="start" spacing={6}>
        <VStack flex={1} spacing={6}>
          <Box bg="background.level1" borderRadius="md" h="400px" />
          <Box bg="background.level1" borderRadius="md" h="200px" />
        </VStack>
        <Box bg="background.level1" borderRadius="md" h="600px" w="400px" />
      </HStack>
    </VStack>
  )
}

function AssetDetailError({ error }: { error: string | null }) {
  return (
    <VStack py={8} spacing={4}>
      <Box color="red.500" fontSize="lg" fontWeight="semibold">
        Error loading asset
      </Box>
      {error && (
        <Box color="font.secondary" textAlign="center">
          {error}
        </Box>
      )}
    </VStack>
  )
}

export function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  return (
    <AssetDetailProviders>
      <AssetDetailProvider assetId={assetId}>
        <FadeInOnView animateOnce={false}>
          <AssetDetailContent />
        </FadeInOnView>
      </AssetDetailProvider>
    </AssetDetailProviders>
  )
}
