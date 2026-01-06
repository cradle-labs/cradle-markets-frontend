'use client'

import { Box, HStack, VStack, Skeleton } from '@chakra-ui/react'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import { AssetDetailProvider, useAssetDetail } from './AssetDetailProvider'
import { AssetBreadcrumbs } from './AssetBreadcrumbs'
import { AssetHeader } from './AssetHeader'
import { AssetChart } from './AssetChart'
import { AssetTradingPanel } from './AssetTradingPanel'
import { AssetInfo } from './AssetInfo'
import { MarketOrders } from './MarketOrders'
import ButtonGroup, {
  ButtonGroupOption,
} from '@repo/lib/shared/components/btns/button-group/ButtonGroup'
import { useState } from 'react'

interface AssetDetailPageProps {
  marketId: string
}

enum ContentTab {
  DETAILS = 'details',
  ORDERS = 'orders',
}

const contentTabs: ButtonGroupOption[] = [
  { value: ContentTab.DETAILS, label: 'Asset Details' },
  { value: ContentTab.ORDERS, label: 'Market Orders' },
]

function AssetDetailContent() {
  const { asset, loading, error } = useAssetDetail()
  console.log('Asset:', asset)
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(contentTabs[0])

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
          {/* Left Column - Chart and Tabbed Content */}
          <VStack align="stretch" flex={2} minW="700px" spacing={6}>
            <AssetChart asset={asset} />

            {/* Tab Navigation */}
            <Box w="25%">
              <ButtonGroup
                currentOption={activeTab}
                groupId="asset-detail-tabs"
                isFullWidth
                onChange={setActiveTab}
                options={contentTabs}
                size="md"
              />
            </Box>

            {/* Tab Content */}
            <Box>
              {activeTab.value === ContentTab.DETAILS ? (
                <AssetInfo asset={asset} />
              ) : (
                <MarketOrders />
              )}
            </Box>
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
    <>
      {/* Header Section Skeleton */}
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
            <VStack align="start" pt="72px" spacing={6} w="full">
              {/* Breadcrumbs skeleton */}
              <HStack spacing={2}>
                <Skeleton h="20px" w="60px" />
                <Box color="font.tertiary">/</Box>
                <Skeleton h="20px" w="80px" />
                <Box color="font.tertiary">/</Box>
                <Skeleton h="20px" w="100px" />
              </HStack>

              {/* Asset header skeleton */}
              <HStack align="center" spacing={4} w="full">
                <Skeleton borderRadius="full" h="16" w="16" />
                <VStack align="start" spacing={2}>
                  <Skeleton h="32px" w="200px" />
                  <HStack spacing={4}>
                    <Skeleton h="24px" w="120px" />
                    <Skeleton h="20px" w="80px" />
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </DefaultPageContainer>
        </Noise>
      </Box>

      {/* Main Content Section Skeleton */}
      <DefaultPageContainer noVerticalPadding pb="xl" pt={['lg', '40px']}>
        <HStack align="start" spacing={6} w="full">
          {/* Left Column - Chart and Content */}
          <VStack align="stretch" flex={2} minW="700px" spacing={6}>
            {/* Chart skeleton with shimmer effect */}
            <Box
              bg="background.level1"
              borderRadius="lg"
              h="400px"
              overflow="hidden"
              position="relative"
            >
              <Skeleton h="full" w="full" />
              {/* Overlay to simulate chart elements */}
              <VStack
                align="start"
                h="full"
                justify="end"
                left={0}
                p={6}
                position="absolute"
                spacing={4}
                top={0}
                w="full"
              >
                <HStack justify="space-between" spacing={4} w="full">
                  <Skeleton h="24px" w="150px" />
                  <Skeleton h="24px" w="100px" />
                </HStack>
                <HStack spacing={2}>
                  <Skeleton h="32px" w="60px" />
                  <Skeleton h="32px" w="60px" />
                  <Skeleton h="32px" w="60px" />
                  <Skeleton h="32px" w="60px" />
                  <Skeleton h="32px" w="60px" />
                </HStack>
              </VStack>
            </Box>

            {/* Tab Navigation skeleton */}
            <Box w="25%">
              <HStack spacing={2}>
                <Skeleton borderRadius="md" h="40px" w="120px" />
                <Skeleton borderRadius="md" h="40px" w="120px" />
              </HStack>
            </Box>

            {/* Tab Content skeleton */}
            <VStack align="stretch" spacing={4}>
              <Skeleton h="32px" w="200px" />
              <VStack spacing={3}>
                <Skeleton borderRadius="md" h="60px" w="full" />
                <Skeleton borderRadius="md" h="60px" w="full" />
                <Skeleton borderRadius="md" h="60px" w="full" />
              </VStack>
            </VStack>
          </VStack>

          {/* Right Column - Trading Panel skeleton */}
          <VStack align="stretch" flex={1} maxW="500px" minW="400px" spacing={4}>
            <Box bg="background.level1" borderRadius="lg" p={6}>
              <VStack align="stretch" spacing={6}>
                {/* Trading tabs */}
                <HStack spacing={2}>
                  <Skeleton borderRadius="md" h="40px" w="80px" />
                  <Skeleton borderRadius="md" h="40px" w="80px" />
                </HStack>

                {/* Form elements */}
                <VStack align="stretch" spacing={4}>
                  <VStack align="start" spacing={2}>
                    <Skeleton h="20px" w="60px" />
                    <Skeleton borderRadius="md" h="48px" w="full" />
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Skeleton h="20px" w="80px" />
                    <Skeleton borderRadius="md" h="48px" w="full" />
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Skeleton h="20px" w="70px" />
                    <Skeleton borderRadius="md" h="48px" w="full" />
                  </VStack>

                  {/* Action buttons */}
                  <VStack pt={4} spacing={3}>
                    <Skeleton borderRadius="md" h="48px" w="full" />
                    <Skeleton borderRadius="md" h="48px" w="full" />
                  </VStack>
                </VStack>
              </VStack>
            </Box>

            {/* Additional info panel */}
            <Box bg="background.level1" borderRadius="lg" p={6}>
              <VStack align="stretch" spacing={4}>
                <Skeleton h="24px" w="120px" />
                <VStack spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Skeleton h="16px" w="100px" />
                    <Skeleton h="16px" w="80px" />
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Skeleton h="16px" w="120px" />
                    <Skeleton h="16px" w="60px" />
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Skeleton h="16px" w="90px" />
                    <Skeleton h="16px" w="70px" />
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </HStack>
      </DefaultPageContainer>
    </>
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

export function AssetDetailPage({ marketId }: AssetDetailPageProps) {
  return (
    <AssetDetailProvider marketId={marketId}>
      <FadeInOnView animateOnce={false}>
        <AssetDetailContent />
      </FadeInOnView>
    </AssetDetailProvider>
  )
}
