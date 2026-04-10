'use client'

import { Box, Button, HStack, VStack } from '@chakra-ui/react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { AssetTradingTabsProvider, useAssetTradingTabs, AssetTradingTab } from './AssetTradingTabs'
import { AssetBuyForm } from './AssetBuyForm'
import { AssetSellForm } from './AssetSellForm'

interface AssetTradingPanelProps {
  asset: TokenizedAssetData
}

function AssetTradingContent() {
  const { activeTab, setActiveTab, tabsList } = useAssetTradingTabs()
  const isBuy = activeTab.value === AssetTradingTab.BUY

  return (
    <Box
      bg="background.level0"
      display="flex"
      flexDirection="column"
      h="full"
      minH={{ base: '600px', lg: 'auto' }}
      overflow="hidden"
      w="full"
    >
      {/* Big Buy/Sell Toggle — impossible to miss */}
      <HStack flexShrink={0} p={3} spacing={2}>
        {tabsList.map(tab => {
          const isActive = tab.value === activeTab.value
          const isTabBuy = tab.value === AssetTradingTab.BUY
          return (
            <Button
              _hover={{
                bg: isActive
                  ? isTabBuy
                    ? 'green.600'
                    : 'red.600'
                  : 'background.level2',
              }}
              bg={isActive ? (isTabBuy ? 'green.500' : 'red.500') : 'background.level1'}
              color={isActive ? 'white' : 'font.primary'}
              flex={1}
              fontSize="md"
              fontWeight="bold"
              h="44px"
              key={tab.value}
              onClick={() => setActiveTab(tab)}
              variant="solid"
            >
              {tab.label}
            </Button>
          )
        })}
      </HStack>

      {/* Accent bar showing active side */}
      <Box bg={isBuy ? 'green.500' : 'red.500'} flexShrink={0} h="2px" mx={3} />

      {/* Form body — scrollable */}
      <Box flex={1} minH={0} overflowY="auto" px={3} py={3}>
        <VStack spacing={3} w="full">
          {isBuy ? <AssetBuyForm /> : <AssetSellForm />}
        </VStack>
      </Box>
    </Box>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AssetTradingPanel(_props: AssetTradingPanelProps) {
  return (
    <AssetTradingTabsProvider>
      <AssetTradingContent />
    </AssetTradingTabsProvider>
  )
}
