'use client'

import { Box, HStack, Text, VStack, Image } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useCurrency } from '@repo/lib/shared/hooks/useCurrency'

interface AssetHeaderProps {
  asset: TokenizedAssetData
}

export function AssetHeader({ asset }: AssetHeaderProps) {
  const { toCurrency } = useCurrency()
  const isPositive = asset.dailyChange >= 0
  const ChangeIcon = isPositive ? ChevronUpIcon : ChevronDownIcon

  return (
    <HStack align="start" justify="space-between" w="full">
      <HStack align="center" spacing={4}>
        <Box
          alignItems="center"
          bg="background.level1"
          borderRadius="full"
          display="flex"
          justifyContent="center"
          p={3}
        >
          <Image
            alt={`${asset.name} logo`}
            boxSize="32px"
            fallback={
              <Box
                alignItems="center"
                bg="gray.200"
                borderRadius="full"
                boxSize="32px"
                display="flex"
                justifyContent="center"
              >
                <Text color="gray.600" fontSize="sm" fontWeight="bold">
                  {asset.name.charAt(0).toUpperCase()}
                </Text>
              </Box>
            }
            src={asset.logo}
          />
        </Box>

        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Text fontSize="2xl" fontWeight="bold">
              {asset.name}
            </Text>
            <Text color="font.secondary" fontSize="lg">
              {asset.symbol}
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Text fontSize="3xl" fontWeight="bold">
              {asset.currentPrice > 0 ? toCurrency(asset.currentPrice) : 'N/A'}
            </Text>
            {asset.currentPrice > 0 && (
              <>
                <HStack color={isPositive ? 'green.500' : 'red.500'} spacing={1}>
                  <ChangeIcon boxSize={4} />
                  <Text fontSize="lg" fontWeight="medium">
                    {toCurrency(Math.abs(asset.dailyChange || 0))} (
                    {Math.abs(asset.dailyChangePercent || 0).toFixed(2)}%)
                  </Text>
                </HStack>
                <Text color="font.secondary" fontSize="sm">
                  1W
                </Text>
              </>
            )}
            {asset.currentPrice === 0 && (
              <Text color="font.tertiary" fontSize="sm">
                Price data unavailable
              </Text>
            )}
          </HStack>
        </VStack>
      </HStack>

      <VStack align="end" spacing={1}>
        <Text color="font.secondary" fontSize="sm">
          Shares Per Token
        </Text>
        <Text fontSize="lg" fontWeight="medium">
          1 {asset.symbol} = 1.00 {asset.name}
        </Text>
      </VStack>
    </HStack>
  )
}
