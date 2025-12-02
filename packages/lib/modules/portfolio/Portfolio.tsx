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
  Badge,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAssetBalances } from '@repo/lib/cradle-client-ts/hooks/accounts/useAssetBalances'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { useLendingPools } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPools'
import { useLoansByWallet } from '@repo/lib/cradle-client-ts/hooks/lending/useLoans'
import { shortenAddress, copyToClipboard } from '@repo/lib/shared/utils/strings'
import { NoisyCard } from '@repo/lib/shared/components/containers/NoisyCard'
import { fromTokenDecimals } from '@repo/lib/modules/lend'
import PortfolioSummary from './PortfolioSummary'

// Helper function to format numbers with commas for thousands
const formatNumberWithCommas = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(num)
}

export default function Portfolio() {
  const { user } = useUser()
  const toast = useToast()
  const [copiedAddress, setCopiedAddress] = useState(false)
  console.log('User in Portfolio:', user?.id)

  // First get the account ID using the Clerk user ID
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })
  console.log('Linked Account:', linkedAccount)

  // Fetch wallet for the account using getWalletByAccount
  const { data: wallet, isLoading: isLoadingWallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })
  console.log('Wallet ID:', wallet?.id)
  console.log('wallet id', wallet?.id)

  // Fetch loans for the wallet
  const {
    data: loans,
    isLoading: isLoadingLoans,
    error: loansError,
  } = useLoansByWallet({
    walletId: wallet?.id || '',
    enabled: !!wallet?.id,
  })

  console.log('Loans:', loans)

  // Fetch all assets
  const { data: assets, isLoading: isLoadingAssets } = useAssets()
  console.log('Assets:', assets)

  // Fetch balances for all assets using the wallet
  const assetBalances = useAssetBalances({
    walletId: wallet?.id || '',
    assetIds: assets?.map(asset => asset.id) || [],
    enabled: !!wallet?.id && !!assets && assets.length > 0,
  })

  // Transform asset balances to the format expected by PortfolioSummary
  const balances = assetBalances
    .filter(balance => balance.data)
    .map(balance => ({
      token: assets?.find(asset => asset.id === balance.assetId)?.token || balance.assetId,
      balance: balance.data?.balance.toString() || '0',
    }))

  const isLoadingBalances = assetBalances.some(balance => balance.isLoading)

  console.log('Asset Balances:', assetBalances)
  console.log('Transformed Balances:', balances)

  // Console log assets the user actually has in their wallet (with non-zero balances)
  const userWalletAssets = balances
    .filter(balance => balance.balance !== '0')
    .map(balance => {
      const asset = assets?.find(a => a.token === balance.token || a.id === balance.token)
      return {
        symbol: asset?.symbol || 'Unknown',
        name: asset?.name || 'Unknown Asset',
        balance: balance.balance,
        assetType: asset?.asset_type || 'unknown',
        token: balance.token,
        assetId: asset?.id,
      }
    })

  console.log('🪙 User Wallet Assets (non-zero balances):', userWalletAssets)

  // Use empty array if no data or error
  const safeLoans = loans || []

  console.log('Loans:', safeLoans)
  console.log('loansError', loansError)

  // Fetch all lending pools for displaying loan details
  const { data: allPools = [] } = useLendingPools()

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
            <Box
              bg="bg.muted"
              borderRadius="lg"
              maxW="500px"
              p={4}
              shadow="xl"
              transition="all 0.2s"
              w={{ base: 'full', sm: '100%', md: '75%', lg: '50%', xl: '40%' }}
            >
              <VStack align="start" gap={3}>
                <HStack
                  flexWrap={{ base: 'wrap', sm: 'nowrap' }}
                  gap={{ base: 3, sm: 0 }}
                  justify="space-between"
                  w="full"
                >
                  <VStack align="start" flex="1" gap={1} minW="0" spacing={0}>
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
                        fontSize={{ base: 'xs', sm: 'sm' }}
                        fontWeight="medium"
                        noOfLines={1}
                        wordBreak="break-all"
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
                      flexShrink={0}
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
          assets={assets || []}
          balances={balances}
          isLoadingAssets={isLoadingAssets}
          isLoadingBalances={isLoadingBalances}
        />

        {/* Active Loans Section */}
        <ActiveLoansSection
          assets={assets || []}
          isLoading={isLoadingLoans}
          loans={safeLoans}
          pools={allPools || []}
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
    name?: string | null
    title?: string | null
    reserve_asset: string
  }>
  assets: Array<{
    id: string
    name: string
    symbol: string
    icon?: string | null
  }>
  isLoading: boolean
}

function ActiveLoansSection({ loans, pools, assets, isLoading }: ActiveLoansSectionProps) {
  const cardBg = useColorModeValue('background.level1', 'background.level1')

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

  // Filter for active loans only with principal amount > 0
  const activeLoans = useMemo(() => {
    return loans.filter(loan => {
      const principalAmount = parseFloat(loan.principal_amount)
      return loan.status === 'active' && principalAmount > 0
    })
  }, [loans])

  const formatCurrency = (amount: string) => {
    // Convert from token decimals (8 decimals) to normalized form
    const normalizedAmount = fromTokenDecimals(parseFloat(amount))
    // Use our custom formatter for better number formatting with commas
    const formattedNumber = formatNumberWithCommas(normalizedAmount)
    return `$${formattedNumber}`
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

      <TableContainer bg={cardBg} borderRadius="lg" shadow="xl" w="full">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Pool</Th>
              <Th>Asset</Th>
              <Th isNumeric>Principal Amount</Th>
              <Th>Borrowed On</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {activeLoans.map(loan => {
              const pool = poolMap.get(loan.pool)
              const asset = pool ? assetMap.get(pool.reserve_asset) : undefined

              return (
                <Tr key={loan.id}>
                  <Td>
                    <Text fontSize="sm" fontWeight="semibold">
                      {pool?.title ?? pool?.name ?? 'Unknown Pool'}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {asset?.icon && (
                        <Box h="20px" w="20px">
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
                      <Text fontSize="sm" fontWeight="medium">
                        {asset?.symbol || 'Unknown'}
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <Text fontSize="sm" fontWeight="semibold">
                      {formatCurrency(loan.principal_amount)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{formatDate(loan.created_at)}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme="green" fontSize="xs">
                      Active
                    </Badge>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}
