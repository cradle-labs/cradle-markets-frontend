'use client'

import { Box, Button, HStack, VStack } from '@chakra-ui/react'
import { PerpsTradingTabsProvider, usePerpsTradingTabs, PerpsTradingTab } from './PerpsTradingTabs'
import { PerpsBuyForm } from './PerpsLongForm'
import { PerpsSellForm } from './PerpsShortForm'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'

function PerpsTradingContent() {
  const { activeTab, setActiveTab, tabsList } = usePerpsTradingTabs()

  return (
    <Box h="full">
      <NoisyCard
        cardProps={{
          border: '1px solid',
          borderColor: 'border.base',
          borderRadius: 'lg',
          h: 'full',
        }}
        contentProps={{
          p: 4,
          position: 'relative',
        }}
        shadowContainerProps={{
          shadow: 'innerBase',
        }}
      >
        <VStack align="stretch" h="full" spacing={4}>
          {/* Buy/Sell Toggle */}
          <HStack bg="background.level0" p="1" rounded="md" shadow="innerXl" spacing="1" w="full">
            {tabsList.map(tab => {
              const isActive = activeTab.value === tab.value
              const isBuy = tab.value === PerpsTradingTab.BUY

              return (
                <Button
                  _hover={{
                    bg: isActive ? (isBuy ? 'green.600' : 'red.600') : 'background.level2',
                  }}
                  bg={isActive ? (isBuy ? 'green.500' : 'red.500') : 'transparent'}
                  color={isActive ? 'white' : 'font.primary'}
                  flex={1}
                  fontSize="lg"
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  key={tab.value}
                  onClick={() => setActiveTab(tab)}
                  size="lg"
                  variant={isActive ? 'solid' : 'ghost'}
                >
                  {tab.label}
                </Button>
              )
            })}
          </HStack>

          {/* Trading Form */}
          <Box flex={1}>
            {activeTab.value === PerpsTradingTab.BUY ? <PerpsBuyForm /> : <PerpsSellForm />}
          </Box>
        </VStack>
      </NoisyCard>
    </Box>
  )
}

export function PerpsTradingPanel() {
  return (
    <PerpsTradingTabsProvider>
      <PerpsTradingContent />
    </PerpsTradingTabsProvider>
  )
}
