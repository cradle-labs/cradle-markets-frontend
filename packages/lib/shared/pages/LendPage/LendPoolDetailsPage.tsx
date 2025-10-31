'use client'

import { useMemo } from 'react'
import {
  Badge,
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useUser } from '@clerk/nextjs'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import {
  getLendingPoolById,
  mockAssets,
  getTotalSuppliedToPool,
  getTotalBorrowedFromPool,
  getPoolUtilizationRate,
  getLendingTransactionsByPool,
  getLoansByPool,
} from '@repo/lib/shared/dummy-data/cradle-data'
import {
  PoolMetricsGrid,
  PoolConfigurationCard,
  PoolInterestModelCard,
  PoolActivityCard,
  LendTradingPanel,
} from '@repo/lib/modules/lend'

interface LendPoolDetailsPageProps {
  poolId: string
}

export function LendPoolDetailsPage({ poolId }: LendPoolDetailsPageProps) {
  const { user } = useUser()

  // First get the account ID using the Clerk user ID
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  // Fetch wallet for the account
  const { data: wallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })
  // Get pool data and enrich it with additional information
  const poolData = useMemo(() => {
    const pool = getLendingPoolById(poolId)
    if (!pool) return null

    const asset = mockAssets.find(a => a.id === pool.reserve_asset)
    const totalSupplied = getTotalSuppliedToPool(pool.id)
    const totalBorrowed = getTotalBorrowedFromPool(pool.id)
    const utilization = getPoolUtilizationRate(pool.id)
    const transactions = getLendingTransactionsByPool(pool.id)
    const loans = getLoansByPool(pool.id)

    // Calculate APYs based on utilization and pool parameters
    const baseRate = parseFloat(pool.base_rate)
    const slope1 = parseFloat(pool.slope1)
    const slope2 = parseFloat(pool.slope2)

    // Simple interest rate model calculation
    let borrowAPY = baseRate
    if (utilization <= 0.8) {
      borrowAPY = baseRate + utilization * slope1
    } else {
      borrowAPY = baseRate + 0.8 * slope1 + (utilization - 0.8) * slope2
    }

    // Supply APY = Borrow APY * Utilization * (1 - Reserve Factor)
    const reserveFactor = parseFloat(pool.reserve_factor)
    const supplyAPY = borrowAPY * utilization * (1 - reserveFactor)

    const availableLiquidity = totalSupplied - totalBorrowed

    return {
      ...pool,
      asset,
      totalSupplied,
      totalBorrowed,
      utilization,
      supplyAPY,
      borrowAPY,
      availableLiquidity,
      transactions,
      loans,
    }
  }, [poolId])

  const fallbackBg = useColorModeValue('gray.100', 'gray.700')
  const fallbackColor = useColorModeValue('gray.600', 'gray.300')

  if (!poolData) {
    return (
      <DefaultPageContainer>
        <Box py="20">
          <Heading size="lg" textAlign="center">
            Pool not found
          </Heading>
          <Text color="text.secondary" mt="4" textAlign="center">
            The lending pool you're looking for doesn't exist.
          </Text>
        </Box>
      </DefaultPageContainer>
    )
  }

  return (
    <>
      {/* Header Section with Noisy Background */}
      <Box borderBottom="1px solid" borderColor="border.base">
        <Noise
          backgroundColor="background.level0WithOpacity"
          overflow="hidden"
          position="relative"
          shadow="innerBase"
        >
          <DefaultPageContainer
            pb={['xl', 'xl', '10']}
            pr={{ base: '0 !important', md: 'md !important' }}
            pt={['xl', '40px']}
          >
            <Box display={{ base: 'none', md: 'block' }}>
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                padding="15px"
                position="absolute"
                right={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                top="40px"
                width={1000}
              />
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                left={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                padding="15px"
                position="absolute"
                top="40px"
                width={1000}
              />
            </Box>
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="-300px"
              width={600}
            />
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="300px"
              width={600}
            />
            <FadeInOnView animateOnce={false}>
              <VStack align="stretch" mb="8" spacing="4">
                <HStack spacing="4">
                  <Box borderRadius="full" flexShrink={0} h="50px" overflow="hidden" w="50px">
                    {poolData.asset?.icon ? (
                      <Image
                        alt={`${poolData.asset.name} logo`}
                        fallback={
                          <Box
                            alignItems="center"
                            bg={fallbackBg}
                            borderRadius="full"
                            display="flex"
                            h="full"
                            justifyContent="center"
                            w="full"
                          >
                            <Text color={fallbackColor} fontSize="lg" fontWeight="bold">
                              {poolData.asset.symbol.charAt(0).toUpperCase()}
                            </Text>
                          </Box>
                        }
                        h="full"
                        objectFit="contain"
                        src={poolData.asset.icon}
                        w="full"
                      />
                    ) : (
                      <Box
                        alignItems="center"
                        bg={fallbackBg}
                        borderRadius="full"
                        display="flex"
                        h="full"
                        justifyContent="center"
                        w="full"
                      >
                        <Text color={fallbackColor} fontSize="lg" fontWeight="bold">
                          {poolData.asset?.symbol?.charAt(0).toUpperCase() || 'P'}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Heading size="xl">{poolData.title || poolData.name}</Heading>
                    <HStack mt="2" spacing="3">
                      <Badge colorScheme="blue" fontSize="sm">
                        {poolData.asset?.symbol}
                      </Badge>
                      <Text color="text.secondary" fontSize="sm">
                        {poolData.asset?.name}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
                <Text color="text.secondary" fontSize="md">
                  {poolData.description}
                </Text>
              </VStack>
            </FadeInOnView>
          </DefaultPageContainer>
        </Noise>
      </Box>

      {/* Main Content */}
      <DefaultPageContainer
        noVerticalPadding
        pb="xl"
        pr={{ base: '0 !important', xl: 'md !important' }}
        pt={['lg', '54px']}
      >
        {/* Key Metrics Grid */}
        <PoolMetricsGrid
          activeLoansCount={poolData.loans.filter(l => l.status === 'active').length}
          availableLiquidity={poolData.availableLiquidity}
          borrowAPY={poolData.borrowAPY}
          supplyAPY={poolData.supplyAPY}
          totalBorrowed={poolData.totalBorrowed}
          totalSupplied={poolData.totalSupplied}
        />

        {/* Pool Configuration and Trading */}
        <Grid
          gap="6"
          mb="8"
          templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
        >
          <PoolConfigurationCard
            liquidationDiscount={poolData.liquidation_discount}
            liquidationThreshold={poolData.liquidation_threshold}
            loanToValue={poolData.loan_to_value}
            reserveFactor={poolData.reserve_factor}
            utilization={poolData.utilization}
          />

          <PoolInterestModelCard
            baseRate={poolData.base_rate}
            poolAddress={poolData.pool_address}
            poolContractId={poolData.pool_contract_id}
            slope1={poolData.slope1}
            slope2={poolData.slope2}
          />

          <LendTradingPanel
            assetName={poolData.asset?.name}
            assetSymbol={poolData.asset?.symbol}
            borrowAPY={poolData.borrowAPY}
            loanToValue={poolData.loan_to_value}
            poolId={poolData.id}
            reserveAssetId={poolData.reserve_asset}
            supplyAPY={poolData.supplyAPY}
            walletId={wallet?.id}
          />
        </Grid>

        {/* Recent Activity */}
        <PoolActivityCard transactions={poolData.transactions} />
      </DefaultPageContainer>
    </>
  )
}
