'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
  useToast,
  Grid,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { useLendingPools } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPools'
import { useLoansByWallet } from '@repo/lib/cradle-client-ts/hooks/lending/useLoans'
import { shortenAddress, copyToClipboard } from '@repo/lib/shared/utils/strings'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import PortfolioSummary from './PortfolioSummary'

export default function Portfolio() {
  const { user } = useUser()
  const toast = useToast()
  const [copiedAddress, setCopiedAddress] = useState(false)

  // First get the account ID using the Clerk user ID
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  // Fetch wallet for the account
  const { data: wallet, isLoading: isLoadingWallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  // Fetch all assets
  const { data: assets, isLoading: isLoadingAssets } = useAssets()

  console.log('Wallet ID:', wallet?.id)

  // Fetch loans for the wallet
  const {
    data: loans,
    isLoading: isLoadingLoans,
    error: loansError,
  } = useLoansByWallet({
    walletId: wallet?.id || '',
    enabled: !!wallet?.id,
  })

  // Use empty array if no data or error
  const safeLoans = loans || []

  console.log('Loans:', safeLoans)
  console.log('loansError', loansError)

  // Fetch all lending pools for displaying loan details
  const { data: allPools = [] } = useLendingPools()

  // Get unique pool IDs from active loans
  const activePoolIds = useMemo(() => {
    const poolIds = new Set<string>()
    safeLoans.forEach(loan => {
      if (loan.status === 'active') {
        poolIds.add(loan.pool)
      }
    })
    return Array.from(poolIds)
  }, [safeLoans])

  console.log('Active Pool IDs:', activePoolIds)

  // Fetch transactions for each pool with active loans
  useEffect(() => {
    if (activePoolIds.length === 0) return

    const fetchPoolTransactions = async () => {
      // Import the action to fetch transactions
      const { getLendingTransactions } = await import('@repo/lib/actions/lending')

      // Fetch transactions for each pool
      for (const poolId of activePoolIds) {
        try {
          const transactions = await getLendingTransactions(poolId)
          console.log(`✅ Transactions for pool ${poolId}:`, transactions)
          console.log(`   Total transactions: ${transactions.length}`)
        } catch (error) {
          console.error(`❌ Error fetching transactions for pool ${poolId}:`, error)
        }
      }
    }

    fetchPoolTransactions()
  }, [activePoolIds])

  // Handle copy to clipboard
  const handleCopyAddress = async (address: string) => {
    // Ensure address has 0x prefix
    const formattedAddress = address.toLowerCase().startsWith('0x') ? address : `0x${address}`

    const success = await copyToClipboard(formattedAddress)
    if (success) {
      setCopiedAddress(true)
      toast({
        title: 'Address copied!',
        description: 'Wallet address copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      })
      setTimeout(() => setCopiedAddress(false), 2000)
    } else {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy address to clipboard',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
      })
    }
  }

  return (
    <Stack gap={8} width="full">
      <VStack align="start" spacing={6} width="full">
        <Heading size="xl">Portfolio</Heading>

        {/* Wallet Section */}
        <Box w="full">
          <Heading mb={4} size="md">
            Wallet
          </Heading>
          {isLoadingWallet ? (
            <Skeleton borderRadius="md" h="80px" w="full" />
          ) : wallet ? (
            <Box bg="bg.muted" borderRadius="lg" p={4} shadow="xl" transition="all 0.2s" w="25%">
              <VStack align="start" gap={3}>
                <HStack justify="space-between" w="full">
                  <VStack align="start" gap={1} spacing={0}>
                    <Text
                      color="font.secondary"
                      fontSize="xs"
                      fontWeight="medium"
                      textTransform="uppercase"
                    >
                      Wallet Address
                    </Text>
                    <Tooltip
                      hasArrow
                      label={
                        wallet.address.toLowerCase().startsWith('0x')
                          ? wallet.address
                          : `0x${wallet.address}`
                      }
                      placement="top"
                    >
                      <Text
                        color="font.primary"
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {shortenAddress(wallet.address, 6, 6)}
                      </Text>
                    </Tooltip>
                  </VStack>
                  <Tooltip
                    hasArrow
                    label={copiedAddress ? 'Copied!' : 'Copy address'}
                    placement="top"
                  >
                    <IconButton
                      aria-label="Copy wallet address"
                      colorScheme={copiedAddress ? 'green' : 'gray'}
                      icon={
                        <svg
                          fill="none"
                          height="16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {copiedAddress ? (
                            <path d="M20 6L9 17l-5-5" />
                          ) : (
                            <>
                              <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </>
                          )}
                        </svg>
                      }
                      isDisabled={copiedAddress}
                      onClick={() => handleCopyAddress(wallet.address)}
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                </HStack>
                {/* {wallet.status && (
                  <Badge
                    colorScheme={wallet.status === 'active' ? 'green' : wallet.status === 'suspended' ? 'red' : 'gray'}
                    fontSize="xs"
                    px={2}
                    py={1}
                    rounded="full"
                    textTransform="capitalize"
                  >
                    {wallet.status}
                  </Badge>
                )} */}
              </VStack>
            </Box>
          ) : (
            <Text color="font.secondary" fontSize="sm">
              No wallet found
            </Text>
          )}
        </Box>

        {/* Asset Balances Section */}
        <PortfolioSummary
          assets={assets}
          isLoadingAssets={isLoadingAssets}
          walletContractId={wallet?.contract_id}
        />

        {/* Active Loans Section */}
        <ActiveLoansSection
          assets={assets || []}
          isLoading={isLoadingLoans}
          loans={safeLoans}
          pools={allPools}
        />
      </VStack>
    </Stack>
  )
}

interface ActiveLoansSectionProps {
  loans: Array<{
    id: string
    wallet_id: string
    pool: string
    principal_amount: string
    borrow_index: string
    created_at: string
    status: string
  }>
  pools: Array<{
    id: string
    name?: string
    title?: string
    reserve_asset: string
  }>
  assets: Array<{
    id: string
    name: string
    symbol: string
    icon?: string
  }>
  isLoading: boolean
}

function ActiveLoansSection({ loans, pools, assets, isLoading }: ActiveLoansSectionProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  const borderColor = useColorModeValue('border.base', 'border.base')

  // Create lookup maps for quick access
  const poolMap = useMemo(() => {
    const map = new Map()
    pools.forEach(pool => map.set(pool.id, pool))
    return map
  }, [pools])

  const assetMap = useMemo(() => {
    const map = new Map()
    assets.forEach(asset => map.set(asset.id, asset))
    return map
  }, [assets])

  // Filter for active loans only
  const activeLoans = useMemo(() => {
    return loans.filter(loan => loan.status === 'active')
  }, [loans])

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <VStack align="start" spacing={6} w="full">
        <Heading
          background="font.special"
          backgroundClip="text"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
        >
          Active Loans
        </Heading>
        <Skeleton borderRadius="lg" h="200px" w="full" />
      </VStack>
    )
  }

  if (activeLoans.length === 0) {
    return (
      <VStack align="start" spacing={6} w="full">
        <Heading
          background="font.special"
          backgroundClip="text"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
        >
          Active Loans
        </Heading>
        <NoisyCard
          cardProps={{
            borderRadius: 'lg',
            w: 'full',
          }}
          contentProps={{
            p: 8,
            position: 'relative',
          }}
          shadowContainerProps={{
            shadow: 'innerXl',
          }}
        >
          <VStack spacing={2}>
            <Text color="font.secondary" fontSize="sm">
              No active loans yet
            </Text>
            <Text color="font.secondary" fontSize="xs">
              Borrow from a lending pool to see your active loans here
            </Text>
          </VStack>
        </NoisyCard>
      </VStack>
    )
  }

  return (
    <VStack align="start" spacing={6} w="full">
      <Heading
        background="font.special"
        backgroundClip="text"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="semibold"
      >
        Active Loans ({activeLoans.length})
      </Heading>

      <Grid
        gap={4}
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        w="full"
      >
        {activeLoans.map(loan => {
          const pool = poolMap.get(loan.pool)
          const asset = pool ? assetMap.get(pool.reserve_asset) : undefined

          return (
            <Box bg={cardBg} borderRadius="lg" key={loan.id} p={5} shadow="xl">
              <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="full">
                  <VStack align="start" spacing={1}>
                    <Text color="font.secondary" fontSize="xs">
                      Pool
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {pool?.title || pool?.name || 'Unknown Pool'}
                    </Text>
                  </VStack>
                  <Badge colorScheme="green" fontSize="xs">
                    Active
                  </Badge>
                </HStack>

                <Box borderColor={borderColor} borderTopWidth="1px" pt={3} w="full">
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text color="font.secondary" fontSize="xs">
                        Principal Amount
                      </Text>
                      <HStack spacing={2}>
                        {asset?.icon && (
                          <Box h="16px" w="16px">
                            <Box
                              alt={asset.symbol}
                              as="img"
                              h="full"
                              objectFit="contain"
                              src={asset.icon}
                              w="full"
                            />
                          </Box>
                        )}
                        <Text fontSize="sm" fontWeight="semibold">
                          {formatCurrency(loan.principal_amount)}
                        </Text>
                      </HStack>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color="font.secondary" fontSize="xs">
                        Asset
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {asset?.symbol || 'Unknown'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text color="font.secondary" fontSize="xs">
                        Borrowed On
                      </Text>
                      <Text fontSize="xs">{formatDate(loan.created_at)}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          )
        })}
      </Grid>
    </VStack>
  )
}
