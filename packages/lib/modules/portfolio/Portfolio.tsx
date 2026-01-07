'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAssetBalances } from '@repo/lib/cradle-client-ts/hooks/accounts/useAssetBalances'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { useLendingPools } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPools'
import { useLoansByWallet } from '@repo/lib/cradle-client-ts/hooks/lending/useLoans'
import { shortenAddress, copyToClipboard } from '@repo/lib/shared/utils/strings'
import { MobileMoneyForm } from '@repo/lib/modules/cash/MobileMoneyForm'
import { TokenizedAssetProvider } from '@repo/lib/modules/trade/TokenizedAssets'
import PortfolioSummary from './PortfolioSummary'
import { ActiveLoansSection } from './ActiveLoansTable'

export default function Portfolio() {
  const { user } = useUser()
  const toast = useToast()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  console.log('User in Portfolio:', user?.id)

  // Check for onramp success via URL query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const reference = urlParams.get('reference')

      if (reference && reference.startsWith('TXN_TEST_')) {
        toast({
          title: 'Success',
          description: 'Successfully funded your wallet with KESy',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        })

        // Clean up the URL by removing the query parameters
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [toast])

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
          <HStack justify="space-between" mb={4} w="full">
            <Heading size="md">Wallet</Heading>
            <Button onClick={onOpen} size="sm" variant="primary">
              Fund Wallet
            </Button>
          </HStack>
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
        <TokenizedAssetProvider>
          <PortfolioSummary
            assets={assets || []}
            balances={balances}
            isLoadingAssets={isLoadingAssets}
            isLoadingBalances={isLoadingBalances}
          />
        </TokenizedAssetProvider>

        {/* Active Loans Section */}
        <ActiveLoansSection
          assets={assets || []}
          isLoading={isLoadingLoans}
          loans={safeLoans}
          pools={allPools || []}
          walletId={wallet?.id || ''}
        />
      </VStack>

      {/* Fund Wallet Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
        <DrawerOverlay bg="blackAlpha.300" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontSize="lg" fontWeight="bold">
              Fund Wallet
            </Text>
          </DrawerHeader>
          <DrawerBody overflowY="auto" pb={6}>
            <MobileMoneyForm onClose={onClose} walletId={wallet?.id} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Stack>
  )
}
