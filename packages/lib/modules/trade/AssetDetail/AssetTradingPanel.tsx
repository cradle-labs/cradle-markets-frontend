'use client'

import { Box, VStack } from '@chakra-ui/react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { AssetTradingTabsProvider, useAssetTradingTabs, AssetTradingTab } from './AssetTradingTabs'
import ButtonGroup from '@repo/lib/shared/components/btns/button-group/ButtonGroup'
import { AssetBuyForm } from './AssetBuyForm'
import { AssetSellForm } from './AssetSellForm'

interface AssetTradingPanelProps {
  asset: TokenizedAssetData
}

function AssetTradingContent() {
  const { activeTab, setActiveTab, tabsList } = useAssetTradingTabs()

  const handleTabChange = (option: any) => {
    setActiveTab(option as typeof activeTab)
  }

  return (
    <Box bg="background.level0" h="full" w="full">
      <Box borderBottom="1px solid" borderColor="border.base" px={3} py={2}>
        <ButtonGroup
          currentOption={activeTab}
          groupId="trading-tabs"
          onChange={handleTabChange}
          options={tabsList}
          size="sm"
        />
      </Box>

      <Box overflowY="auto" px={3} py={3}>
        <VStack spacing={3} w="full">
          {activeTab.value === AssetTradingTab.BUY ? <AssetBuyForm /> : <AssetSellForm />}
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
