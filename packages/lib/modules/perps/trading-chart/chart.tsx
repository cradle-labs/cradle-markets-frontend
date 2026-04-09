'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, HStack, Text, useColorMode } from '@chakra-ui/react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
  HistogramSeries,
  HistogramData,
} from 'lightweight-charts'

export interface CandlestickDataWithVolume extends CandlestickData {
  volume?: number
}

export interface TradingChartProps {
  symbol?: string
  data?: CandlestickDataWithVolume[]
  selectedPrice?: number | null
  selectedTime?: Time | null
  onCrosshairMove?: (price: number | null, time: Time | null) => void
  onTimeFrameChange?: (timeFrame: string) => void
  activeTimeFrame?: string
}

const TIME_FRAMES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const

export function TradingChart({
  symbol = 'SHARES/USDC',
  data,
  onCrosshairMove,
  onTimeFrameChange,
  activeTimeFrame = '1M',
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const { colorMode } = useColorMode()

  const quoteSymbol = symbol.includes('/') ? symbol.split('/')[1] : '$'

  const [currentPrice, setCurrentPrice] = useState<number | null>(null)

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price)
    const separator = quoteSymbol === '$' ? '' : ' '
    return `${quoteSymbol}${separator}${formatted}`
  }

  const handleCrosshairMove = useCallback(
    (price: number | null, time: Time | null) => {
      onCrosshairMove?.(price, time)
    },
    [onCrosshairMove]
  )

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const isDark = colorMode === 'dark'
    const textColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)'
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'
    const crosshairColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 420,
      layout: {
        background: { color: 'transparent' },
        textColor,
        fontSize: 11,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: crosshairColor,
          style: 2,
          labelBackgroundColor: isDark ? '#2D3748' : '#E2E8F0',
        },
        horzLine: {
          width: 1,
          color: crosshairColor,
          style: 2,
          labelBackgroundColor: isDark ? '#2D3748' : '#E2E8F0',
        },
      },
      rightPriceScale: {
        borderColor,
        scaleMargins: {
          top: 0.05,
          bottom: 0.25, // Leave space for volume
        },
      },
      timeScale: {
        borderColor,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: true,
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickVisible: true,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries

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
      } catch {
        setCurrentPrice(null)
      }
    })

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight || 420,
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
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || !data || data.length === 0)
      return

    const formattedCandles: CandlestickData[] = data.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))

    const volumeData: HistogramData[] = data.map(d => ({
      time: d.time,
      value: d.volume ?? 0,
      color:
        d.close >= d.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    }))

    candlestickSeriesRef.current.setData(formattedCandles)
    volumeSeriesRef.current.setData(volumeData)

    if (formattedCandles.length > 0) {
      setCurrentPrice(formattedCandles[formattedCandles.length - 1].close)
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [data])

  const latestCandle = data && data.length > 0 ? data[data.length - 1] : null
  const prevCandle = data && data.length > 1 ? data[data.length - 2] : null

  const displayPrice =
    typeof currentPrice === 'number'
      ? currentPrice
      : latestCandle?.close ?? 0

  const priceChange =
    latestCandle && prevCandle ? latestCandle.close - prevCandle.close : 0
  const priceChangePercent =
    latestCandle && prevCandle && prevCandle.close !== 0
      ? (priceChange / prevCandle.close) * 100
      : 0

  return (
    <Box bg="background.level0" display="flex" flexDirection="column" h="full" w="full">
      {/* Chart header */}
      <HStack
        borderBottom="1px solid"
        borderColor="border.base"
        justify="space-between"
        px={3}
        py={2}
        w="full"
        wrap="wrap"
      >
        <HStack spacing={3}>
          <Text fontSize="sm" fontWeight="semibold">
            {symbol}
          </Text>
          <Text
            color={priceChange >= 0 ? 'green.400' : 'red.400'}
            fontFamily="mono"
            fontSize="sm"
            fontWeight="bold"
          >
            {formatPrice(displayPrice)}
          </Text>
          <Text
            color={priceChange >= 0 ? 'green.400' : 'red.400'}
            fontFamily="mono"
            fontSize="xs"
          >
            {priceChange >= 0 ? '+' : ''}
            {priceChangePercent.toFixed(2)}%
          </Text>
        </HStack>

        {/* Timeframe buttons */}
        <HStack spacing={0}>
          {TIME_FRAMES.map(tf => (
            <Box
              _hover={{ color: 'font.primary', bg: 'background.level1' }}
              bg={activeTimeFrame === tf ? 'background.level2' : 'transparent'}
              borderRadius="sm"
              color={activeTimeFrame === tf ? 'font.primary' : 'font.secondary'}
              cursor="pointer"
              fontSize="xs"
              fontWeight={activeTimeFrame === tf ? 'bold' : 'medium'}
              key={tf}
              onClick={() => onTimeFrameChange?.(tf)}
              px={2}
              py={1}
            >
              {tf}
            </Box>
          ))}
        </HStack>
      </HStack>

      {/* Chart canvas */}
      <Box flex={1} minH="300px" ref={chartContainerRef} w="full" />
    </Box>
  )
}

export default TradingChart
