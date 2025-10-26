'use client'

import { createContext, PropsWithChildren, useMemo, useState, useCallback } from 'react'
import { ColorMode, useTheme as useChakraTheme } from '@chakra-ui/react'
import { useCurrency } from '@repo/lib/shared/hooks/useCurrency'
import { useTheme as useNextTheme } from 'next-themes'
import { format } from 'date-fns'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useMandatoryContext } from '@repo/lib/shared/utils/contexts'
import { alignUtcWithLocalDay } from '@repo/lib/shared/utils/time'

export enum AssetChartPeriod {
  ONE_DAY = '1D',
  ONE_WEEK = '1W', 
  ONE_MONTH = '1M',
  THREE_MONTHS = '3M',
  ONE_YEAR = '1Y',
  ALL_TIME = 'ALL'
}

interface AssetChartPeriodOption {
  value: AssetChartPeriod
  label: string
}

const assetChartPeriods: AssetChartPeriodOption[] = [
  { value: AssetChartPeriod.ONE_DAY, label: '1D' },
  { value: AssetChartPeriod.ONE_WEEK, label: '1W' },
  { value: AssetChartPeriod.ONE_MONTH, label: '1M' },
  { value: AssetChartPeriod.THREE_MONTHS, label: '3M' },
  { value: AssetChartPeriod.ONE_YEAR, label: '1Y' },
  { value: AssetChartPeriod.ALL_TIME, label: 'ALL' },
]

const getDefaultAssetChartOptions = (
  currencyFormatter: (value: number) => string,
  nextTheme: ColorMode = 'dark',
  theme: any
) => {
  const toolTipTheme = {
    heading: 'font-weight: bold; color: #E5D3BE',
    container: `background: ${theme.colors.gray[800]};`,
    text: theme.colors.gray[400],
  }

  const colorMode = nextTheme === 'dark' ? '_dark' : 'default'
  
  return {
    grid: {
      left: '1.5%',
      right: '2.5%',
      top: '7.5%',
      bottom: '0',
      containLabel: true,
    },
    xAxis: {
      show: true,
      type: 'time',
      minorSplitLine: { show: false },
      axisTick: { show: false },
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => {
          return format(new Date(value * 1000), 'MMM d')
        },
        color: theme.semanticTokens.colors.font.primary[colorMode],
        opacity: 0.5,
        interval: 0,
        showMaxLabel: false,
        showMinLabel: false,
      },
      axisPointer: {
        type: 'line',
        label: {
          formatter: (params: any) => {
            return format(new Date(params.value * 1000), 'MMM d')
          },
        },
      },
      axisLine: { show: false },
      splitArea: {
        show: false,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
        },
      },
    },
    yAxis: {
      show: true,
      type: 'value',
      axisLine: { show: false },
      minorSplitLine: { show: false },
      splitLine: { show: false },
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => {
          return currencyFormatter(value)
        },
        color: theme.semanticTokens.colors.font.primary[colorMode],
        opacity: 0.5,
        interval: 'auto',
        showMaxLabel: false,
        showMinLabel: false,
      },
    },
    tooltip: {
      show: true,
      showContent: true,
      trigger: 'axis',
      confine: true,
      axisPointer: {
        animation: false,
        type: 'shadow',
        label: {
          show: false,
        },
      },
      extraCssText: `padding-right:2rem;border: none;${toolTipTheme.container}`,
      formatter: (params: any) => {
        const data = Array.isArray(params) ? params[0] : params
        const date = new Date(data.value[0] * 1000)
        const formattedDate = format(date, 'MMM d')

        return `
          <div style="padding: none; display: flex; flex-direction: column; justify-content: center;${
            toolTipTheme.container
          }">
            <div style="font-size: 0.85rem; font-weight: 500; color: ${toolTipTheme.text};">
              ${formattedDate}
            </div>
            <div style="font-size: 14px; font-weight: 500; color: ${toolTipTheme.text};">
              ${currencyFormatter(data.value[1])}
            </div>
          </div>
        `
      },
    },
  }
}

type AssetChartContextType = ReturnType<typeof useAssetChartLogic>

const AssetChartContext = createContext<AssetChartContextType | null>(null)

export function useAssetChartLogic(asset: TokenizedAssetData) {
  const { toCurrency } = useCurrency()
  const { theme: nextTheme } = useNextTheme()
  const theme = useChakraTheme()
  const [chartValue, setChartValue] = useState(0)
  const [chartDate, setChartDate] = useState('')
  const [activePeriod, setActivePeriod] = useState(assetChartPeriods[1]) // Default to 1W

  const chartData = useMemo(() => {
    if (!asset.priceHistory || asset.priceHistory.length === 0) return []

    // For demo purposes, let's use the latest timestamp from the data as "now"
    const latestTimestamp = Math.max(...asset.priceHistory.map(([timestamp]) => timestamp))
    let filteredData = asset.priceHistory

    switch (activePeriod.value) {
      case AssetChartPeriod.ONE_DAY:
        filteredData = asset.priceHistory.filter(([timestamp]) => latestTimestamp - timestamp < 86400)
        break
      case AssetChartPeriod.ONE_WEEK:
        filteredData = asset.priceHistory.filter(([timestamp]) => latestTimestamp - timestamp < 604800)
        break
      case AssetChartPeriod.ONE_MONTH:
        filteredData = asset.priceHistory.filter(([timestamp]) => latestTimestamp - timestamp < 2592000)
        break
      case AssetChartPeriod.THREE_MONTHS:
        filteredData = asset.priceHistory.filter(([timestamp]) => latestTimestamp - timestamp < 7776000)
        break
      case AssetChartPeriod.ONE_YEAR:
        filteredData = asset.priceHistory.filter(([timestamp]) => latestTimestamp - timestamp < 31536000)
        break
      // ALL_TIME shows all data
    }

    // Sort by timestamp and convert to the format expected by ECharts
    // Apply timezone alignment like pool charts do
    return filteredData
      .sort((a, b) => a[0] - b[0])
      .map(([timestamp, price]) => [alignUtcWithLocalDay(timestamp), price.toString()])
  }, [asset.priceHistory, activePeriod.value])

  const defaultChartOptions = getDefaultAssetChartOptions(toCurrency, nextTheme as ColorMode, theme)

  const options = useMemo(() => {
    const isPositive = asset.dailyChange >= 0
    const lineColor = isPositive ? '#10B981' : '#EF4444' // green or red

    return {
      ...defaultChartOptions,
      series: [
        {
          type: 'line',
          data: chartData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: lineColor,
          },
          itemStyle: {
            color: lineColor,
            borderRadius: 100,
          },
          emphasis: {
            itemStyle: {
              color: lineColor,
              borderColor: lineColor,
            },
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${lineColor}20`, // 20% opacity
                },
                {
                  offset: 1,
                  color: `${lineColor}00`, // 0% opacity
                },
              ],
            },
          },
          animationEasing: function (k: number) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k)
          },
        },
      ],
    }
  }, [chartData, defaultChartOptions, asset.dailyChange])

  const handleAxisMoved = useCallback(
    ({ dataIndex }: { dataIndex: number }) => {
      const chartHoverValue = chartData?.[dataIndex]?.[1]
      const chartHoverDate = chartData?.[dataIndex]?.[0]
      if (!chartHoverValue || !chartHoverDate) return

      setChartValue(Number(chartHoverValue))
      setChartDate(format(new Date(Number(chartHoverDate) * 1000), 'dd MMM yyyy'))
    },
    [chartData]
  )

  return {
    chartData,
    activePeriod,
    setActivePeriod,
    chartValue,
    chartDate,
    options,
    handleAxisMoved,
    hasChartData: !!chartData.length,
  }
}

export function AssetChartProvider({ children, asset }: PropsWithChildren & { asset: TokenizedAssetData }) {
  const hook = useAssetChartLogic(asset)
  return <AssetChartContext.Provider value={hook}>{children}</AssetChartContext.Provider>
}

export const useAssetChart = (): AssetChartContextType =>
  useMandatoryContext(AssetChartContext, 'AssetChart')
