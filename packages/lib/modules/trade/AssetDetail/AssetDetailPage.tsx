'use client'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AssetDetailProvider, useAssetDetail } from './AssetDetailProvider'
import { MarketInfoBar } from './MarketInfoBar'
import { AssetChart } from './AssetChart'
import { AssetTradingPanel } from './AssetTradingPanel'
import { MarketOrders } from './MarketOrders'
import { SpotOrderBook } from './SpotOrderBook'
import { AssetInfo } from './AssetInfo'

interface AssetDetailPageProps {
  marketId: string
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
    <Box bg="background.level0" pt="72px" w="full">
      {/* Top: Market info bar — sticky right below the nav bar */}
      <Box
        bg="background.level0"
        borderBottom="1px solid"
        borderColor="border.base"
        position="sticky"
        top="72px"
        zIndex={10}
      >
        <MarketInfoBar asset={asset} />
      </Box>

      {/* Primary area: Chart + Trading Panel side by side */}
      <Box
        borderBottom="1px solid"
        borderColor="border.base"
        display={{ base: 'block', lg: 'grid' }}
        gridTemplateColumns={{ lg: 'minmax(0, 1fr) 380px' }}
        minH={{ base: 'auto', lg: 'calc(100vh - 72px - 48px - 80px)' }}
      >
        {/* Chart — takes most of the viewport */}
        <Box
          borderColor="border.base"
          borderRight={{ base: 'none', lg: '1px solid' }}
          h={{ base: '400px', lg: 'full' }}
          minH="400px"
          overflow="hidden"
        >
          <AssetChart asset={asset} />
        </Box>

        {/* Trading Panel — prominent, full-height on desktop */}
        <Box h={{ base: 'auto', lg: 'full' }} overflow="hidden">
          <AssetTradingPanel asset={asset} />
        </Box>
      </Box>

      {/* Secondary area: Collapsible accordion sections
          Default: Order Book and My Orders open, Market Info closed */}
      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <AccordionItem border="none" borderBottom="1px solid" borderColor="border.base">
          <h3>
            <AccordionButton
              _hover={{ bg: 'background.level1' }}
              bg="background.level0"
              px={4}
              py={3}
            >
              <HStack flex={1} spacing={3} textAlign="left">
                <Text fontSize="sm" fontWeight="semibold">
                  Order Book
                </Text>
                <Text color="font.secondary" fontSize="xs">
                  Bids and asks for this market
                </Text>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
          </h3>
          <AccordionPanel maxH="500px" overflow="hidden" p={0}>
            <Box h="500px">
              <SpotOrderBook />
            </Box>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none" borderBottom="1px solid" borderColor="border.base">
          <h3>
            <AccordionButton
              _hover={{ bg: 'background.level1' }}
              bg="background.level0"
              px={4}
              py={3}
            >
              <HStack flex={1} spacing={3} textAlign="left">
                <Text fontSize="sm" fontWeight="semibold">
                  My Orders
                </Text>
                <Text color="font.secondary" fontSize="xs">
                  Your open and closed orders for this market
                </Text>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
          </h3>
          <AccordionPanel maxH="500px" overflow="hidden" p={0}>
            <Box h="500px">
              <MarketOrders />
            </Box>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <h3>
            <AccordionButton
              _hover={{ bg: 'background.level1' }}
              bg="background.level0"
              px={4}
              py={3}
            >
              <HStack flex={1} spacing={3} textAlign="left">
                <Text fontSize="sm" fontWeight="semibold">
                  About {asset.name}
                </Text>
                <Text color="font.secondary" fontSize="xs">
                  Market details and asset information
                </Text>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
          </h3>
          <AccordionPanel p={4}>
            <AssetInfo asset={asset} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

function AssetDetailSkeleton() {
  return (
    <Box bg="background.level0" pt="72px" w="full">
      <HStack
        borderBottom="1px solid"
        borderColor="border.base"
        h="48px"
        px={4}
        spacing={6}
      >
        <Skeleton h="24px" w="120px" />
        <Skeleton h="24px" w="100px" />
        <Skeleton h="16px" w="80px" />
        <Skeleton h="16px" w="80px" />
      </HStack>

      <Box
        borderBottom="1px solid"
        borderColor="border.base"
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 380px' }}
        h="calc(100vh - 72px - 48px - 200px)"
        minH="500px"
      >
        <Box borderRight="1px solid" borderColor="border.base" p={4}>
          <Skeleton h="full" w="full" />
        </Box>
        <Box p={4}>
          <VStack align="stretch" spacing={4}>
            <Skeleton h="40px" w="full" />
            <Skeleton h="80px" w="full" />
            <Skeleton h="80px" w="full" />
            <Skeleton h="50px" w="full" />
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}

function AssetDetailError({ error }: { error: string | null }) {
  return (
    <VStack h="calc(100vh - 72px)" justify="center" pt="72px" spacing={4}>
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
      <AssetDetailContent />
    </AssetDetailProvider>
  )
}
