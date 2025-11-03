'use client'

import { useState, useMemo } from 'react'
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
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { useLendingTransactionsByWallet } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingTransactions'
import { useLendingPools } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPools'
import { useLoansByWallet } from '@repo/lib/cradle-client-ts/hooks/lending/useLoans'
import { shortenAddress, copyToClipboard } from '@repo/lib/shared/utils/strings'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import PortfolioSummary from './PortfolioSummary'

export default function Portfolio() {
  const { user } = useUser()
  const router = useRouter()
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

  // Fetch lending transactions for the wallet
  const { data: lendingTransactions = [], isLoading: isLoadingTransactions } =
    useLendingTransactionsByWallet({
      walletId: wallet?.id || '',
      enabled: !!wallet?.id,
    })

  // Fetch loans for the wallet
  const { data: loans = [], isLoading: isLoadingLoans } = useLoansByWallet({
    walletId: wallet?.id || '',
    enabled: !!wallet?.id,
  })

  // Fetch all lending pools
  const { data: allPools = [], isLoading: isLoadingPools } = useLendingPools()

  // Get unique pool IDs from transactions and loans
  const userPoolIds = useMemo(() => {
    const poolIds = new Set<string>()
    lendingTransactions.forEach(tx => poolIds.add(tx.pool))
    loans.forEach(loan => poolIds.add(loan.pool))
    return Array.from(poolIds)
  }, [lendingTransactions, loans])

  // Filter pools to only those the user has interacted with
  const userPools = useMemo(() => {
    return allPools.filter(pool => userPoolIds.includes(pool.id))
  }, [allPools, userPoolIds])

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

        {/* Lending Pools Section */}
        <LendingPoolsSection
          isLoading={isLoadingPools || isLoadingTransactions || isLoadingLoans}
          onPoolClick={(poolId: string) => router.push(`/lend/${poolId}`)}
          pools={userPools}
        />
      </VStack>
    </Stack>
  )
}

interface LendingPoolsSectionProps {
  pools: Array<{
    id: string
    name?: string
    title?: string
    description?: string
    reserve_asset: string
    loan_to_value: string
    base_rate: string
  }>
  isLoading: boolean
  onPoolClick: (poolId: string) => void
}

function LendingPoolsSection({ pools, isLoading, onPoolClick }: LendingPoolsSectionProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')
  const fallbackBg = useColorModeValue('background.level2', 'background.level2')
  const fallbackColor = useColorModeValue('font.secondary', 'font.secondary')

  if (isLoading) {
    return (
      <VStack align="start" spacing={6} w="full">
        <Heading
          background="font.special"
          backgroundClip="text"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
        >
          My Lending Pools
        </Heading>
        <Grid
          gap={4}
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          w="full"
        >
          <Skeleton borderRadius="lg" h="180px" w="full" />
          <Skeleton borderRadius="lg" h="180px" w="full" />
          <Skeleton borderRadius="lg" h="180px" w="full" />
        </Grid>
      </VStack>
    )
  }

  if (pools.length === 0) {
    return (
      <VStack align="start" spacing={6} w="full">
        <Heading
          background="font.special"
          backgroundClip="text"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="semibold"
        >
          My Lending Pools
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
              You haven't interacted with any lending pools yet
            </Text>
            <Text color="font.secondary" fontSize="xs">
              Start by supplying liquidity or borrowing from a pool
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
        My Lending Pools
      </Heading>

      <Grid
        gap={4}
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        w="full"
      >
        {pools.map(pool => (
          <Box
            _hover={{
              transform: 'translateY(-2px)',
              cursor: 'pointer',
            }}
            bg={cardBg}
            borderRadius="lg"
            key={pool.id}
            onClick={() => onPoolClick(pool.id)}
            p={5}
            shadow="xl"
            transition="all 0.2s"
          >
            <VStack align="start" spacing={3}>
              <HStack spacing={3}>
                <Box borderRadius="full" flexShrink={0} h="40px" overflow="hidden" w="40px">
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
                      {(pool.name || pool.title || 'P').charAt(0).toUpperCase()}
                    </Text>
                  </Box>
                </Box>
                <VStack align="start" flex={1} spacing={0}>
                  <Text fontSize="md" fontWeight="semibold" noOfLines={1}>
                    {pool.title || pool.name || 'Unnamed Pool'}
                  </Text>
                  <Badge colorScheme="blue" fontSize="xs">
                    Active
                  </Badge>
                </VStack>
              </HStack>

              {pool.description && (
                <Text color="font.secondary" fontSize="xs" noOfLines={2}>
                  {pool.description}
                </Text>
              )}

              <VStack align="start" spacing={1} w="full">
                <HStack justify="space-between" w="full">
                  <Text color="font.secondary" fontSize="xs">
                    LTV
                  </Text>
                  <Text fontSize="xs" fontWeight="medium">
                    {(parseFloat(pool.loan_to_value) * 100).toFixed(0)}%
                  </Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text color="font.secondary" fontSize="xs">
                    Base Rate
                  </Text>
                  <Text fontSize="xs" fontWeight="medium">
                    {(parseFloat(pool.base_rate) * 100).toFixed(2)}%
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        ))}
      </Grid>
    </VStack>
  )
}
