'use client'

import { Heading, Stack, VStack } from '@chakra-ui/react'
import PortfolioSummary from './PortfolioSummary'

export default function Portfolio() {
  return (
    <Stack gap={8} width="full">
      <VStack align="start" spacing={6} width="full">
        <Heading size="xl">Portfolio</Heading>

        {/* Asset Balances Section */}
        <PortfolioSummary />
      </VStack>
    </Stack>
  )
}
