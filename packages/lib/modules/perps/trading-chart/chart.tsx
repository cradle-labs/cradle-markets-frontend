'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, HStack, VStack, Text, useColorMode } from '@chakra-ui/react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
} from 'lightweight-charts'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import ButtonGroup from '@repo/lib/shared/components/btns/button-group/ButtonGroup'

export interface TradingChartProps {
  symbol?: string
  data?: CandlestickData[]
  selectedPrice?: number | null
  selectedTime?: Time | null
  onCrosshairMove?: (price: number | null, time: Time | null) => void
}

type ChartData = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M'

// Simulated data generator for demo purposes
const generateSimulatedData = (days: number): ChartData[] => {
  const data: ChartData[] = []
  const now = new Date()
  let currentPrice = 100 // Starting price for tokenized share

  for (let i = days - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)

    // Random price movement
    const volatility = 0.02 // 2% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility

    const open = currentPrice
    const close = open * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.random() * 1000000 + 100000

    data.push({
      time: time.toISOString().split('T')[0],
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume: Number(volume.toFixed(0)),
    })

    currentPrice = close
  }

  return data
}

export function TradingChart({ symbol = 'SHARES/USDC', data, onCrosshairMove }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const { colorMode } = useColorMode()

  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1D')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])

  // Memoize the crosshair move handler to prevent unnecessary re-renders
  const handleCrosshairMove = useCallback(
    (price: number | null, time: Time | null) => {
      onCrosshairMove?.(price, time)
    },
    [onCrosshairMove]
  )

  // Generate or use provided data
  useEffect(() => {
    if (data) {
      setChartData(
        data.map(d => ({
          time: d.time as string,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: 0, // Volume not provided in CandlestickData
        }))
      )
    } else {
      // Generate simulated data based on timeframe
      const days =
        activeTimeFrame === '1H'
          ? 7
          : activeTimeFrame === '4H'
            ? 30
            : activeTimeFrame === '1D'
              ? 90
              : activeTimeFrame === '1W'
                ? 365
                : 730
      setChartData(generateSimulatedData(days))
    }
  }, [data, activeTimeFrame])

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'transparent' },
        textColor: colorMode === 'dark' ? '#ffffff' : '#000000',
      },
      grid: {
        vertLines: {
          color: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        horzLines: {
          color: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      crosshair: {
        mode: 0, // Normal mode instead of magnet mode
        vertLine: {
          width: 1,
          color: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          style: 0,
        },
      },
      rightPriceScale: {
        borderColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      },
      timeScale: {
        borderColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80',
      downColor: '#ef4444',
      borderVisible: true,
      borderUpColor: '#4ade80',
      borderDownColor: '#ef4444',
      wickVisible: true,
      wickUpColor: '#4ade80',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries

    // Handle crosshair movement with improved error handling
    chart.subscribeCrosshairMove(param => {
      try {
        if (param.time && param.seriesData) {
          const seriesData = param.seriesData.get(candlestickSeries)
          if (seriesData && typeof seriesData === 'object' && 'close' in seriesData) {
            const candleData = seriesData as CandlestickData
            setCurrentPrice(candleData.close)
            handleCrosshairMove(candleData.close, param.time)
          }
        } else {
          setCurrentPrice(null)
          handleCrosshairMove(null, null)
        }
      } catch (error) {
        console.warn('Chart crosshair move error:', error)
        setCurrentPrice(null)
      }
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [colorMode])

  // Update chart data
  useEffect(() => {
    if (candlestickSeriesRef.current && chartData.length > 0) {
      const formattedData = chartData.map(d => ({
        time: d.time as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))

      candlestickSeriesRef.current.setData(formattedData)

      // Set current price to latest close
      if (formattedData.length > 0) {
        setCurrentPrice(formattedData[formattedData.length - 1].close)
      }

      // Fit content to ensure all candlesticks are visible
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent()
      }
    }
  }, [chartData])

  const handleTimeFrameChange = (option: any) => {
    setActiveTimeFrame(option.value)
  }

  const latestData = chartData[chartData.length - 1]

  // Safely parse price values
  const safeCurrentPrice =
    typeof currentPrice === 'number'
      ? currentPrice
      : latestData?.close && typeof latestData.close === 'number'
        ? latestData.close
        : 0

  const priceChange =
    latestData && chartData.length > 1
      ? latestData.close - chartData[chartData.length - 2].close
      : 0
  const priceChangePercent =
    latestData && chartData.length > 1
      ? (priceChange / chartData[chartData.length - 2].close) * 100
      : 0

  return (
    <NoisyCard>
      <VStack h="full" p={{ base: 'sm', md: 'md' }} spacing={4} w="full">
        {/* Header with price info and timeframe buttons */}
        <HStack justify="space-between" w="full" wrap="wrap">
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold">
              {symbol}
            </Text>
            <HStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">
                ${safeCurrentPrice.toFixed(4)}
              </Text>
              <Text color={priceChange >= 0 ? 'green.400' : 'red.400'} fontSize="sm">
                {priceChange >= 0 ? '+' : ''}
                {priceChange.toFixed(4)} ({priceChangePercent >= 0 ? '+' : ''}
                {priceChangePercent.toFixed(2)}%)
              </Text>
            </HStack>
          </VStack>

          <ButtonGroup
            currentOption={{ label: activeTimeFrame, value: activeTimeFrame }}
            groupId="timeframe"
            onChange={handleTimeFrameChange}
            options={[
              { label: '1H', value: '1H' },
              { label: '4H', value: '4H' },
              { label: '1D', value: '1D' },
              { label: '1W', value: '1W' },
              { label: '1M', value: '1M' },
            ]}
            size="sm"
          />
        </HStack>

        {/* Chart container with isolation */}
        <Box
          h="400px"
          position="relative"
          ref={chartContainerRef}
          sx={{
            '& *': {
              pointerEvents: 'auto',
            },
            '&:hover': {
              transform: 'none',
            },
            '& canvas': {
              position: 'relative',
              zIndex: 2,
            },
          }}
          w="full"
          zIndex={1}
        />

        {/* Chart info */}
        <HStack color="gray.500" fontSize="sm" justify="space-between" w="full">
          <Text>Volume: {latestData?.volume.toLocaleString() || 'N/A'}</Text>
        </HStack>
      </VStack>
    </NoisyCard>
  )
}

export default TradingChart
