'use client'

import { Box, VStack } from '@chakra-ui/react'
import { TradingChart } from './chart'
import { useState, useCallback } from 'react'
import { Time } from 'lightweight-charts'

export function TradingChartExample() {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<Time | null>(null)

  const handleCrosshairMove = useCallback((price: number | null, time: Time | null) => {
    setSelectedPrice(price)
    setSelectedTime(time)
  }, [])

  return (
    <VStack spacing={6} w="full">
      {/* Main trading chart */}
      <Box w="full">
        <TradingChart
          onCrosshairMove={handleCrosshairMove}
          selectedPrice={selectedPrice}
          selectedTime={selectedTime}
          symbol="SHARES/USDC"
        />
      </Box>
    </VStack>
  )
}

export default TradingChartExample
