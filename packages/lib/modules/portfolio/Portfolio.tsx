'use client'

import { useState } from 'react'
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
} from '@chakra-ui/react'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { shortenAddress, copyToClipboard } from '@repo/lib/shared/utils/strings'
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
      </VStack>
    </Stack>
  )
}
