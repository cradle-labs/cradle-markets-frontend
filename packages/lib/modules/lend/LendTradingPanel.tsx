'use client'

import { useState } from 'react'
import { Box, Card, CardBody, CardHeader, VStack } from '@chakra-ui/react'
import { LendSupplyForm } from './LendSupplyForm'
import { LendBorrowForm } from './LendBorrowForm'
import ButtonGroup, {
  ButtonGroupOption,
} from '@repo/lib/shared/components/btns/button-group/ButtonGroup'

interface LendTradingPanelProps {
  poolId: string
  walletId?: string
  assetSymbol?: string
  assetName?: string
  reserveAssetId: string
  supplyAPY: number
  borrowAPY: number
  loanToValue: string
  onTransactionSuccess?: () => void
}

type TabValue = 'supply' | 'borrow'

export function LendTradingPanel({
  poolId,
  walletId,
  assetSymbol,
  assetName,
  reserveAssetId,
  supplyAPY,
  borrowAPY,
  loanToValue,
  onTransactionSuccess,
}: LendTradingPanelProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('supply')

  const tabsList: ButtonGroupOption[] = [
    { label: 'Supply', value: 'supply' },
    { label: 'Borrow', value: 'borrow' },
  ]

  const handleTabChange = (option: ButtonGroupOption) => {
    setActiveTab(option.value as TabValue)
  }

  return (
    <Card rounded="xl">
      <CardHeader w="full">
        <Box display="inline-block">
          <ButtonGroup
            currentOption={tabsList.find(tab => tab.value === activeTab)}
            groupId="lend-tabs"
            onChange={handleTabChange}
            options={tabsList}
            size="sm"
          />
        </Box>
      </CardHeader>

      <CardBody>
        <VStack spacing={4} w="full">
          {activeTab === 'supply' ? (
            <LendSupplyForm
              assetSymbol={assetSymbol}
              onSuccess={onTransactionSuccess}
              poolId={poolId}
              reserveAssetId={reserveAssetId}
              supplyAPY={supplyAPY}
              walletId={walletId}
            />
          ) : (
            <LendBorrowForm
              assetName={assetName}
              assetSymbol={assetSymbol}
              borrowAPY={borrowAPY}
              loanToValue={loanToValue}
              poolId={poolId}
              reserveAssetId={reserveAssetId}
              walletId={walletId}
            />
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}
