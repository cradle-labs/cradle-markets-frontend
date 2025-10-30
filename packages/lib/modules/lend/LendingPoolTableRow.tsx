'use client'

import {
  Box,
  Grid,
  GridItem,
  GridProps,
  HStack,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { LendingPoolData } from './LendingPoolTable'

interface LendingPoolTableRowProps extends GridProps {
  pool: LendingPoolData
  index: number
  onPoolClick?: (pool: LendingPoolData) => void
}

export function LendingPoolTableRow({
  pool,
  index,
  onPoolClick,
  ...rest
}: LendingPoolTableRowProps) {
  const fallbackBg = useColorModeValue('gray.200', 'gray.600')
  const fallbackColor = useColorModeValue('gray.700', 'gray.200')

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number = 0) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const utilizationColor = useColorModeValue(
    pool.utilization && pool.utilization > 0.8 ? 'orange.500' : 'green.500',
    pool.utilization && pool.utilization > 0.8 ? 'orange.400' : 'green.400'
  )

  return (
    <FadeInOnView>
      <Box
        _hover={{
          bg: 'background.level0',
        }}
        as={onPoolClick ? 'button' : 'div'}
        cursor={onPoolClick ? 'pointer' : 'default'}
        onClick={onPoolClick ? () => onPoolClick(pool) : undefined}
        px={{ base: '0', sm: 'md' }}
        rounded="md"
        transition="all 0.2s ease-in-out"
        w="full"
      >
        <Grid pr="4" py={{ base: 'ms', md: 'md' }} {...rest}>
          {/* Row Number */}
          <GridItem>
            <Text color="font.secondary" fontSize="sm">
              {index + 1}
            </Text>
          </GridItem>

          {/* Pool Name */}
          <GridItem>
            <HStack align="start" spacing={3}>
              {pool.asset && (
                <Box borderRadius="md" flexShrink={0} h={8} overflow="hidden" w={8}>
                  <Image
                    alt={`${pool.asset.name} logo`}
                    fallback={
                      <Box
                        alignItems="center"
                        bg={fallbackBg}
                        borderRadius="md"
                        display="flex"
                        h="full"
                        justifyContent="center"
                        w="full"
                      >
                        <Text color={fallbackColor} fontSize="sm" fontWeight="bold">
                          {pool.asset.symbol.charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                    }
                    h="full"
                    objectFit="contain"
                    src={pool.asset.icon}
                    w="full"
                  />
                </Box>
              )}
              <VStack align="start" flex={1} spacing={0}>
                <Text fontSize="sm" fontWeight="bold">
                  {pool.name}
                </Text>
                <Text color="font.secondary" fontSize="xs" noOfLines={1}>
                  {pool.title}
                </Text>
              </VStack>
            </HStack>
          </GridItem>

          {/* Total Supplied */}
          <GridItem justifySelf="end">
            <Text fontSize="sm" fontWeight="medium">
              {formatCurrency(pool.totalSupplied)}
            </Text>
          </GridItem>

          {/* Total Borrowed */}
          <GridItem justifySelf="end">
            <Text fontSize="sm" fontWeight="medium">
              {formatCurrency(pool.totalBorrowed)}
            </Text>
          </GridItem>

          {/* Utilization */}
          <GridItem justifySelf="end">
            <Text color={utilizationColor} fontSize="sm" fontWeight="medium">
              {formatPercent(pool.utilization)}
            </Text>
          </GridItem>

          {/* Supply APY */}
          <GridItem justifySelf="end">
            <Text color="green.400" fontSize="sm" fontWeight="medium">
              {formatPercent(pool.supplyAPY)}
            </Text>
          </GridItem>

          {/* Borrow APY */}
          <GridItem justifySelf="end">
            <Text fontSize="sm" fontWeight="medium">
              {formatPercent(pool.borrowAPY)}
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </FadeInOnView>
  )
}
