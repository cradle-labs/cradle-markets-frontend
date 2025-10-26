'use client'

import { Box, Card, HStack, VStack, Text, Skeleton } from '@chakra-ui/react'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import ButtonGroup from '@repo/lib/shared/components/btns/button-group/ButtonGroup'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { AssetChartProvider, useAssetChart } from './AssetChartProvider'
import { AssetChartPeriod } from './AssetChartProvider'
import ReactECharts from 'echarts-for-react'

interface AssetChartProps {
  asset: TokenizedAssetData
}

function AssetChartContent() {
  const { 
    activePeriod, 
    setActivePeriod, 
    chartValue, 
    chartDate, 
    options, 
    handleAxisMoved,
    hasChartData 
  } = useAssetChart()

  const handlePeriodChange = (option: any) => {
    setActivePeriod(option)
  }

  if (!hasChartData) {
    return (
      <Card>
        <Skeleton h="400px" w="full" />
      </Card>
    )
  }

  return (
    <NoisyCard>
      <VStack h="full" p={{ base: 'sm', md: 'md' }} w="full">
        <HStack justify="space-between" w="full" wrap="wrap">
          <HStack gap="10px" wrap="wrap">
            <ButtonGroup
              currentOption={activePeriod}
              groupId="chart-period"
              onChange={handlePeriodChange}
              options={[
                { label: '1D', value: AssetChartPeriod.ONE_DAY },
                { label: '1W', value: AssetChartPeriod.ONE_WEEK },
                { label: '1M', value: AssetChartPeriod.ONE_MONTH },
                { label: '3M', value: AssetChartPeriod.THREE_MONTHS },
                { label: '1Y', value: AssetChartPeriod.ONE_YEAR },
                { label: 'ALL', value: AssetChartPeriod.ALL_TIME },
              ]}
              size="xxs"
            />
          </HStack>

          <VStack align="end" spacing={1}>
            {chartValue > 0 && chartDate && (
              <>
                <Text color="font.secondary" fontSize="sm">
                  {chartDate}
                </Text>
                <Text fontSize="lg" fontWeight="medium">
                  {new Intl.NumberFormat('en-KE', {
                    style: 'currency',
                    currency: 'KES',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(chartValue)}
                </Text>
              </>
            )}
          </VStack>
        </HStack>

        <Box h="350px" w="full">
          <ReactECharts
            onEvents={{
              updateAxisPointer: handleAxisMoved,
            }}
            option={options}
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      </VStack>
    </NoisyCard>
  )
}

export function AssetChart({ asset }: AssetChartProps) {
  return (
    <AssetChartProvider asset={asset}>
      <AssetChartContent />
    </AssetChartProvider>
  )
}
