'use client'

import { Box, Button, HStack, Input, Text, useToast, VStack } from '@chakra-ui/react'
import { useState, useMemo, useEffect } from 'react'
import { SelectInput, SelectOption } from '../inputs/SelectInput'
import { requestOnramp } from '@repo/lib/actions/onramp'
import { blockInvalidNumberInput } from '@repo/lib/shared/utils/numbers'
import { toTokenDecimals } from '@repo/lib/modules/lend/utils'
import type { Asset } from '@repo/lib/cradle-client-ts/types'

export enum CashMode {
  PAY = 'pay',
  FUND_WALLET = 'fund-wallet',
}

export enum PaymentType {
  MOBILE_NUMBER = 'mobile-number',
  PAYBILL = 'paybill',
  BUY_GOODS = 'buy-goods',
}

interface MobileMoneyFormProps {
  mode: CashMode
  onModeChange?: (mode: CashMode) => void
  walletId?: string
  onClose?: () => void
  assets?: Asset[]
}

export function MobileMoneyForm({ walletId, onClose, assets = [] }: MobileMoneyFormProps) {
  const toast = useToast()
  const [selectedAssetId, setSelectedAssetId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create asset options for the dropdown - only show KESy_TESTNET
  const assetOptions: SelectOption[] = useMemo(() => {
    const targetAssetId = '3ba160f6-39c6-4718-b46f-46650b841f74'
    const filteredAssets = assets.filter(asset => asset.id === targetAssetId)
    return filteredAssets.map(asset => ({
      value: asset.id,
      label: `${asset.symbol} - ${asset.name}`,
    }))
  }, [assets])

  console.log('Asset Options:', assetOptions)

  // Set default asset if available - specifically KESy_TESTNET
  useEffect(() => {
    const targetAssetId = '3ba160f6-39c6-4718-b46f-46650b841f74'
    const targetAsset = assets.find(asset => asset.id === targetAssetId)
    if (targetAsset && !selectedAssetId) {
      setSelectedAssetId(targetAsset.id)
    }
  }, [assets, selectedAssetId])

  // Get selected asset details
  const selectedAsset = useMemo(() => {
    return assets.find(asset => asset.id === selectedAssetId)
  }, [assets, selectedAssetId])

  const handleSubmit = async () => {
    if (!walletId) {
      toast({
        title: 'Wallet not found',
        description: 'Please ensure you have a wallet set up',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!selectedAssetId) {
      toast({
        title: 'Asset required',
        description: 'Please select an asset to purchase',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Convert amount to token decimals for backend submission
      // Uses 8 decimals for demo tokens
      const amountInTokenDecimals = toTokenDecimals(parseFloat(amount)).toString()

      // Get the result page URL (current page or portfolio)
      const resultPage =
        typeof window !== 'undefined' ? window.location.origin + '/portfolio' : '/portfolio'

      const payload = {
        walletId,
        assetId: selectedAssetId,
        amount: amountInTokenDecimals,
        resultPage,
      }

      const result = await requestOnramp(payload)

      if (result.success && result.data) {
        // Redirect to authorization URL
        if (result.data.authorization_url) {
          window.location.href = result.data.authorization_url
        } else {
          toast({
            title: 'Success',
            description: 'Onramp request created successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          onClose?.()
        }
      } else {
        toast({
          title: 'Failed to create onramp request',
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
      setIsSubmitting(false)
    }
  }

  return (
    <VStack spacing={4} w="full">
      {/* Asset Selection */}
      <VStack align="start" spacing={2} w="full">
        <Text color="font.secondary" fontSize="sm" fontWeight="medium">
          Select Asset
        </Text>
        <Box w="full">
          <SelectInput
            id="asset-selector"
            isSearchable={true}
            onChange={setSelectedAssetId}
            options={assetOptions}
            value={selectedAssetId}
          />
        </Box>
      </VStack>

      {/* Amount Input */}
      <VStack align="start" spacing={2} w="full">
        <HStack justify="space-between" w="full">
          <Text color="font.secondary" fontSize="sm" fontWeight="medium">
            Amount (KES)
          </Text>
        </HStack>
        <Box bg="background.level0" borderRadius="md" p={['ms', 'md']} shadow="innerBase" w="full">
          <VStack align="start" spacing="md">
            <HStack spacing={2} w="full">
              <Input
                _focus={{
                  outline: 'none',
                  border: '0px solid transparent',
                  boxShadow: 'none',
                }}
                _hover={{
                  border: '0px solid transparent',
                  boxShadow: 'none',
                }}
                autoComplete="off"
                autoCorrect="off"
                bg="transparent"
                border="0px solid transparent"
                boxShadow="none"
                flex={1}
                fontSize="3xl"
                fontWeight="medium"
                min={0}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={blockInvalidNumberInput}
                onWheel={e => {
                  // Avoid changing the input value when scrolling
                  return e.currentTarget.blur()
                }}
                outline="none"
                p="0"
                placeholder="0.00"
                shadow="none"
                step="any"
                type="number"
                value={amount}
              />
              <Text color="font.primary" fontSize="xl" fontWeight="bold">
                KES
              </Text>
            </HStack>

            {selectedAsset && (
              <HStack justify="space-between" w="full">
                <Text color="font.secondary" fontSize="xs">
                  Purchasing {selectedAsset.symbol}
                </Text>
                {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                  <Text color="font.secondary" fontSize="xs">
                    ≈{' '}
                    {Number(amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    KES
                  </Text>
                )}
              </HStack>
            )}
          </VStack>
        </Box>
      </VStack>

      {/* Submit Button */}
      <Button
        isDisabled={!selectedAssetId || !amount || Number(amount) <= 0}
        isLoading={isSubmitting}
        loadingText="Processing..."
        onClick={handleSubmit}
        size="lg"
        variant="primary"
        w="full"
      >
        Fund Wallet
      </Button>
    </VStack>
  )
}
