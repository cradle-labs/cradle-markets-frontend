'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
  VStack,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { requestFaucetTokens } from '@repo/lib/actions/faucet'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'

export function FaucetPage() {
  const { user } = useUser()
  const toast = useToast()
  const [selectedAsset, setSelectedAsset] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  // Get the account ID using the Clerk user ID
  const { data: linkedAccount, isLoading: isLoadingAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  // Fetch wallet for the account to get wallet address and enable balance refetching
  const {
    data: wallet,
    isLoading: isLoadingWallet,
    refetch: refetchWallet,
  } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  // Fetch all assets and filter for cpUSD only
  const { data: allAssets, isLoading: isLoadingAssets } = useAssets()

  // Filter to only show cpUSD (Cradle Pegged USD)
  const assets = allAssets?.filter(
    asset =>
      asset.symbol.toLowerCase() === 'cpusd' ||
      asset.name.toLowerCase().includes('cradle pegged usd')
  )

  // Automatically select cpUSD when assets are loaded
  useEffect(() => {
    if (assets && assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0].id)
    }
  }, [assets, selectedAsset])

  const handleRequestTokens = async () => {
    if (!linkedAccount?.id || !selectedAsset) {
      toast({
        title: 'Missing information',
        description: 'Please select an asset and ensure you are logged in',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!wallet?.id || !wallet?.address) {
      toast({
        title: 'Wallet not found',
        description: 'Please ensure your account has a wallet set up',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsRequesting(true)
    try {
      const result = await requestFaucetTokens({
        account: linkedAccount.id,
        asset: selectedAsset,
      })

      if (result.success) {
        // Refetch wallet balance to update UI with new balance
        refetchWallet()

        toast({
          title: 'Success!',
          description: `cpUSD tokens have been airdropped to wallet ${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setSelectedAsset('')
      } else {
        toast({
          title: 'Failed to request tokens',
          description: result.error || 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsRequesting(false)
    }
  }

  const isLoading = isLoadingAccount || isLoadingAssets || isLoadingWallet

  return (
    <DefaultPageContainer>
      <VStack align="stretch" gap={6} maxW="600px" mx="auto" py={8}>
        <Box>
          <Heading mb={2} size="lg">
            Token Faucet
          </Heading>
          <Text color="gray.400">
            Request cpUSD (Cradle Pegged USD) test tokens for your account
          </Text>
        </Box>

        <Card>
          <CardBody>
            {isLoading ? (
              <VStack py={8}>
                <Spinner size="lg" />
                <Text>Loading...</Text>
              </VStack>
            ) : !linkedAccount ? (
              <VStack py={8}>
                <Text>Please log in to use the faucet</Text>
              </VStack>
            ) : !wallet ? (
              <VStack py={8}>
                <Text>Wallet not found. Please ensure your account has a wallet set up.</Text>
              </VStack>
            ) : (
              <VStack align="stretch" gap={4}>
                x
                <FormControl isRequired>
                  <FormLabel>Asset</FormLabel>
                  <Select
                    onChange={e => setSelectedAsset(e.target.value)}
                    placeholder="Select cpUSD..."
                    value={selectedAsset}
                  >
                    {assets?.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.symbol})
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  isDisabled={!selectedAsset || isRequesting}
                  isLoading={isRequesting}
                  loadingText="Requesting cpUSD..."
                  onClick={handleRequestTokens}
                  size="lg"
                  variant="primary"
                >
                  Request cpUSD
                </Button>
              </VStack>
            )}
          </CardBody>
        </Card>
      </VStack>
    </DefaultPageContainer>
  )
}
