'use client'

import { useMemo } from 'react'
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { ChevronRight, Home } from 'react-feather'
import { useUser } from '@clerk/nextjs'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAsset } from '@repo/lib/cradle-client-ts/hooks/assets/useAsset'
import {
  useLendingPool,
  usePoolStats,
} from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPool'
import { useQuery } from '@tanstack/react-query'
import { cradleQueryKeys } from '@repo/lib/cradle-client-ts/queryKeys'
import type { Loan } from '@repo/lib/cradle-client-ts/types'
import type { PoolTransactionType } from '@repo/lib/cradle-client-ts/types'
import {
  PoolMetricsGrid,
  PoolConfigurationCard,
  PoolInterestModelCard,
  // PoolActivityCard,
  LendTradingPanel,
  fromBasisPoints,
  fromTokenDecimals,
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

  // Fetch pool data
  const { data: pool, isLoading: isLoadingPool } = useLendingPool({ poolId })
  console.log('pool', pool)
  // Fetch pool stats (metrics)
  const {
    data: poolStats,
    isLoading: isLoadingSnapshot,
    refetch: refetchPoolStats,
  } = usePoolStats({
    poolId,
    enabled: !!pool,
  })

  // Fetch asset details
  const { data: asset, isLoading: isLoadingAsset } = useAsset({
    assetId: pool?.reserve_asset || '',
    enabled: !!pool?.reserve_asset,
  })

  // Fetch transactions (stubbed for now - hook doesn't exist)
  interface LendingTransaction {
    id: string
    transaction_type: PoolTransactionType
    amount: number
    created_at: string
  }
  const { data: transactions = [], refetch: refetchTransactions } = useQuery<LendingTransaction[]>({
    queryKey: cradleQueryKeys.lendingPools.transactions(poolId),
    queryFn: async () => {
      // TODO: Implement when getLendingTransactions action is available
      return []
    },
    enabled: !!pool,
  })

  // Fetch loans by pool (stubbed for now - hook doesn't exist)
  const { data: loans = [] } = useQuery<Loan[]>({
    queryKey: cradleQueryKeys.loans.listByPool(poolId),
    queryFn: async () => {
      // TODO: Implement when getLoansByPool action is available
      return []
    },
    enabled: !!pool,
  })

  // Combine all data
  const poolData = useMemo(() => {
    if (!pool) return null

    // Convert token amounts from decimals to normalized form using actual asset decimals
    // Note: poolStats uses 'utilization', 'supply_rate', 'borrow_rate' (not 'utilization_rate', 'supply_apy', 'borrow_apy')
    const assetDecimals = asset?.decimals ?? 8
    const totalSupplied =
      poolStats?.total_supplied != null
        ? fromTokenDecimals(Number(poolStats.total_supplied as string | number), assetDecimals)
        : 0
    const totalBorrowed =
      poolStats?.total_borrowed != null
        ? fromTokenDecimals(Number(poolStats.total_borrowed as string | number), assetDecimals)
        : 0
    const utilization =
      poolStats?.utilization != null ? fromBasisPoints(poolStats.utilization as string | number) : 0
    const supplyAPY =
      poolStats?.supply_rate != null ? fromBasisPoints(poolStats.supply_rate as string | number) : 0
    const borrowAPY =
      poolStats?.borrow_rate != null ? fromBasisPoints(poolStats.borrow_rate as string | number) : 0
    const availableLiquidity =
      poolStats?.liquidity != null
        ? fromTokenDecimals(Number(poolStats.liquidity as string | number), assetDecimals)
        : totalSupplied - totalBorrowed

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
  }, [pool, poolStats, asset, transactions, loans])
  console.log('poolData', poolData)

  const fallbackBg = useColorModeValue('gray.100', 'gray.700')
  const fallbackColor = useColorModeValue('gray.600', 'gray.300')

  // Loading state
  if (isLoadingPool || isLoadingSnapshot || isLoadingAsset) {
    return (
      <DefaultPageContainer>
        <Box alignItems="center" display="flex" justifyContent="center" minH="400px">
          <Spinner size="xl" />
        </Box>
      </DefaultPageContainer>
    )
  }

  // Error/Not found state
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
                {poolData && (
                  <Breadcrumb
                    color="grayText"
                    fontSize="sm"
                    pb="ms"
                    separator={
                      <Box color="border.base">
                        <ChevronRight size={16} />
                      </Box>
                    }
                    spacing="sm"
                  >
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <Button color="grayText" size="xs" variant="link">
                          <Home size={16} />
                        </Button>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <BreadcrumbLink fontWeight="medium" href="/lend">
                        Lend
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                      <BreadcrumbLink href="#">
                        {poolData.title || poolData.name} ({poolData.asset?.symbol})
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                )}
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
                        src={poolData.asset.icon ?? undefined}
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
          activeLoansCount={poolData.loans.filter((l: Loan) => l.status === 'active').length}
          availableLiquidity={poolData.availableLiquidity}
          baseRate={fromBasisPoints(poolData.base_rate)}
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
            assetDecimals={
              poolData.asset?.decimals != null ? Number(poolData.asset.decimals) : undefined
            }
            assetName={poolData.asset?.name}
            assetSymbol={poolData.asset?.symbol}
            baseRate={fromBasisPoints(poolData.base_rate)}
            borrowAPY={poolData.borrowAPY}
            loanToValue={poolData.loan_to_value}
            onTransactionSuccess={() => {
              refetchTransactions()
              refetchPoolStats()
            }}
            poolId={poolData.id}
            reserveAssetId={poolData.reserve_asset}
            supplyAPY={poolData.supplyAPY}
            walletId={wallet?.id}
          />
        </Grid>

        {/* Recent Activity */}
        {/* <PoolActivityCard transactions={poolData.transactions} /> */}
      </DefaultPageContainer>
    </>
  )
}
