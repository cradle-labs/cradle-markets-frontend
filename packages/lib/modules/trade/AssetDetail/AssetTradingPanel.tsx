'use client'

import { Box, Card, CardBody, CardHeader, VStack } from '@chakra-ui/react'
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
    <Card rounded="xl">
      <CardHeader w="full">
        <Box display="inline-block">
          <ButtonGroup
            currentOption={activeTab}
            groupId="trading-tabs"
            onChange={handleTabChange}
            options={tabsList}
            size="sm"
          />
        </Box>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={4} w="full">
          {activeTab.value === AssetTradingTab.BUY ? (
            <AssetBuyForm />
          ) : (
            <AssetSellForm />
          )}
        </VStack>
      </CardBody>
    </Card>
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
