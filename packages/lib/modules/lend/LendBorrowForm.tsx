'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
  FormHelperText,
  HStack,
} from '@chakra-ui/react'
import { borrowAsset } from '@repo/lib/actions/lending'
import { useDepositPosition } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPool'
import { useAssetMultiplier } from '@repo/lib/cradle-client-ts/hooks/lending/useAssetMultiplier'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks'
import { useAssetBalances } from '@repo/lib/cradle-client-ts/hooks/accounts/useAssetBalances'
import { SelectInput, SelectOption } from '@repo/lib/shared/components/inputs/SelectInput'
import { fromBasisPoints, toTokenDecimals, fromTokenDecimals } from './utils'

/**
 * Deposit position structure from the API
 */
interface DepositPosition {
  yield_token_balance?: string | number
  underlying_value?: string | number
  current_supply_apy?: string | number
  borrowed?: string | number
  borrowed_amount?: string | number
  [key: string]: unknown
}

interface LendBorrowFormProps {
  poolId: string
  walletId?: string
  assetSymbol?: string
  assetName?: string
  reserveAssetId: string
  borrowAPY?: number
  loanToValue: string
  assetDecimals?: number
  onSuccess?: () => void
  baseRate: number
}

export function LendBorrowForm({
  poolId,
  walletId,
  assetSymbol,
  loanToValue,
  assetDecimals,
  onSuccess,
  baseRate,
}: LendBorrowFormProps) {
  const [amount, setAmount] = useState('')
  const [selectedCollateralId, setSelectedCollateralId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Fetch all assets to get tokenized stock assets for collateral
  const { data: allAssets } = useAssets()

  // Filter only tokenized stock assets
  const collateralAssets = useMemo(() => {
    if (!allAssets) return []
    return allAssets.filter(asset => asset.asset_type === 'bridged')
  }, [allAssets])

  // Fetch balances for collateral assets to show which ones user has
  const collateralAssetIds = useMemo(
    () => collateralAssets.map(asset => asset.id),
    [collateralAssets]
  )

  const collateralBalances = useAssetBalances({
    walletId: walletId || '',
    assetIds: collateralAssetIds,
    enabled: !!walletId && collateralAssetIds.length > 0,
  })

  const selectedCollateralAsset = useMemo(() => {
    return collateralAssets.find(asset => asset.id === selectedCollateralId)
  }, [collateralAssets, selectedCollateralId])

  const collateralSymbol = selectedCollateralAsset?.symbol || ''

  const ltvDecimal = useMemo(() => fromBasisPoints(loanToValue), [loanToValue])

  // Fetch collateral price from pool oracle using the multiplier endpoint
  const { data: priceOracle, isLoading: isPriceLoading } = useAssetMultiplier({
    poolId,
    assetId: selectedCollateralId,
    enabled: !!poolId && !!selectedCollateralId,
  })
  console.log('price oracle', priceOracle)

  const collateralPrice = useMemo(() => {
    if (!priceOracle?.price) {
      return 0
    }
    // Oracle returns price in KESN smallest units per collateral unit
    // Divide by KESN decimals (6) to get human-readable KESN per collateral
    return fromTokenDecimals(parseFloat(priceOracle.price), assetDecimals ?? 6)
  }, [priceOracle, assetDecimals])

  // Create select options for collateral assets
  const collateralOptions: SelectOption[] = useMemo(() => {
    return collateralAssets.map(asset => {
      const balance = collateralBalances.find(b => b.assetId === asset.id)
      const hasBalance = balance?.data && balance.data.balance > 0
      const balanceText =
        hasBalance && balance.data
          ? ` (${formatAmount(fromTokenDecimals(balance.data.balance, balance.data.decimals))})`
          : ''

      return {
        label: (
          <HStack spacing={2}>
            <Text>{asset.symbol}</Text>
            {hasBalance && (
              <Text color="white" fontSize="xs">
                {balanceText}
              </Text>
            )}
          </HStack>
        ),
        value: asset.id,
      }
    })
  }, [collateralAssets, collateralBalances])

  // Set default collateral if none selected and we have options
  useMemo(() => {
    if (!selectedCollateralId && collateralOptions.length > 0) {
      // Prefer assets with balance, otherwise use first option
      const assetWithBalance = collateralOptions.find((_, index) => {
        const asset = collateralAssets[index]
        const balance = collateralBalances.find(b => b.assetId === asset.id)
        return balance?.data && balance.data.balance > 0
      })
      setSelectedCollateralId(assetWithBalance?.value || collateralOptions[0].value)
    }
  }, [selectedCollateralId, collateralOptions, collateralAssets, collateralBalances])

  // Fetch deposit position to get supplied amount (for cpUSD pool)
  const { data: depositPosition, refetch: refetchDepositPosition } = useDepositPosition({
    poolId,
    walletId: walletId || '',
    enabled: !!walletId && !!poolId,
  })

  // Get the collateral balance for the selected asset
  const collateralBalance = useMemo(() => {
    if (!selectedCollateralId) return 0
    const balance = collateralBalances.find(b => b.assetId === selectedCollateralId)
    if (!balance?.data) return 0
    return fromTokenDecimals(balance.data.balance, balance.data.decimals)
  }, [selectedCollateralId, collateralBalances])

  // Calculate available borrow amount based on collateral value and LTV
  // Available borrow (cpUSD) = (collateral balance * price * LTV) - already borrowed
  const availableBorrow = useMemo(() => {
    if (collateralBalance <= 0 || collateralPrice <= 0 || ltvDecimal <= 0) return 0

    const maxBorrowable = collateralBalance * collateralPrice * ltvDecimal

    // If deposit position has borrowed amount, subtract it
    const position = depositPosition as DepositPosition | undefined
    const borrowed =
      position?.borrowed || position?.borrowed_amount
        ? fromTokenDecimals(
            Number(position.borrowed || position.borrowed_amount || 0),
            assetDecimals
          )
        : 0

    return Math.max(0, maxBorrowable - borrowed)
  }, [collateralBalance, collateralPrice, ltvDecimal, depositPosition, assetDecimals])

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? fromBasisPoints(value) : value
    return `${(numValue * 100).toFixed(2)}%`
  }

  const calculateRequiredCollateral = () => {
    const borrowAmount = parseFloat(amount)
    if (!borrowAmount || borrowAmount <= 0 || collateralPrice <= 0 || ltvDecimal <= 0) return 0
    // Required collateral = borrowAmount (KESN) / (price in KESN per collateral * LTV)
    return borrowAmount / (collateralPrice * ltvDecimal)
  }

  const requiredCollateral = useMemo(calculateRequiredCollateral, [
    amount,
    collateralPrice,
    ltvDecimal,
  ])

  const requiredCollateralValueUsd = useMemo(
    () => requiredCollateral * collateralPrice,
    [requiredCollateral, collateralPrice]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletId) {
      toast({
        title: 'Wallet Required',
        description: 'Account not found.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!selectedCollateralId) {
      toast({
        title: 'Collateral Required',
        description: 'Please select a collateral asset',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (collateralPrice <= 0) {
      toast({
        title: 'Price Unavailable',
        description: 'Unable to fetch collateral price. Please try again shortly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid borrow amount',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    // Validate borrow amount doesn't exceed available (only if we have deposit position data)
    if (parseFloat(amount) > availableBorrow) {
      toast({
        title: 'Insufficient Collateral',
        description: `You can only borrow up to ${formatAmount(
          availableBorrow
        )} ${assetSymbol || 'tokens'} based on your supplied collateral`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      // Get collateral asset decimals from balance data
      const collateralBalanceData = collateralBalances.find(b => b.assetId === selectedCollateralId)
      const collateralAssetDecimals =
        collateralBalanceData?.data?.decimals ?? selectedCollateralAsset?.decimals ?? 8
      console.log('collateralAssetDecimals', collateralAssetDecimals)
      console.log('requiredCollateral', requiredCollateral)
      console.log('collateralPrice', collateralPrice)
      console.log('ltvDecimal', ltvDecimal)
      console.log('collateralBalance', collateralBalance)
      console.log('availableBorrow', availableBorrow)
      console.log('amount', amount)
      console.log('walletId', walletId)
      console.log('poolId', poolId)
      console.log('selectedCollateralId', selectedCollateralId)
      console.log('selectedCollateralAsset', selectedCollateralAsset)

      // The amount field should be the required collateral amount (in collateral asset units)
      // Convert required collateral from normalized form to token decimals
      const collateralAmountInDecimals = toTokenDecimals(
        requiredCollateral,
        collateralAssetDecimals
      )

      const borrowAssetPayload = {
        wallet: walletId,
        pool: poolId,
        amount: collateralAmountInDecimals, // Pass collateral amount, not borrow amount
        collateral: selectedCollateralId,
      }

      console.log('Borrow Asset Payload:', {
        ...borrowAssetPayload,
        borrowAmountCpUsd: parseFloat(amount),
        requiredCollateralAmount: requiredCollateral,
        collateralSymbol,
        collateralDecimals: collateralAssetDecimals,
      })

      const result = await borrowAsset(borrowAssetPayload)

      console.log('Borrow Result:', result)

      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully borrowed ${amount} ${assetSymbol || 'tokens'}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setAmount('')
        // Refetch deposit position to update available borrow
        refetchDepositPosition()
        // Note: collateral balances will be automatically refetched due to dependency changes
        // Refetch pool details after successful borrow
        onSuccess?.()
      } else {
        toast({
          title: 'Borrow Failed',
          description: result.error || 'Failed to borrow asset',
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
      setIsLoading(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <VStack spacing={4} w="full">
        <FormControl isRequired>
          <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium">
            Collateral Asset
          </FormLabel>
          {collateralOptions.length > 0 ? (
            <SelectInput
              id="collateral-select"
              onChange={setSelectedCollateralId}
              options={collateralOptions}
              value={selectedCollateralId}
            />
          ) : (
            <Box
              bg="background.level1"
              border="1px solid"
              borderColor="border.base"
              borderRadius="md"
              p={4}
            >
              <Text color="text.tertiary" fontSize="sm">
                Loading collateral assets...
              </Text>
            </Box>
          )}
          <FormHelperText color="text.tertiary" fontSize="xs">
            Select a tokenized stock asset (e.g., SAF) to use as collateral.
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <HStack justify="space-between" mb={2}>
            <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium" mb={0}>
              Amount to Borrow
            </FormLabel>
            {walletId && collateralBalance > 0 && (
              <HStack spacing={2}>
                <Text color="text.tertiary" fontSize="xs">
                  Collateral: {formatAmount(collateralBalance)}{' '}
                  {collateralAssets.find(a => a.id === selectedCollateralId)?.symbol || ''}
                </Text>
              </HStack>
            )}
          </HStack>
          <Input
            isInvalid={!!(amount && parseFloat(amount) > availableBorrow)}
            max={availableBorrow > 0 ? availableBorrow : undefined}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            size="lg"
            step="0.01"
            type="number"
            value={amount}
          />
          <FormHelperText color="text.tertiary" fontSize="xs">
            {walletId && collateralBalance > 0 ? (
              <>
                You can borrow up to{' '}
                <Text as="span" fontWeight="bold">
                  {formatAmount(availableBorrow)}
                </Text>{' '}
                {assetSymbol} based on your {collateralSymbol || 'collateral'} value
              </>
            ) : (
              `Borrow ${assetSymbol} at ${formatPercentage(baseRate)} APY`
            )}
          </FormHelperText>
          {selectedCollateralId && collateralPrice <= 0 && !isPriceLoading && (
            <Text color="orange.300" fontSize="xs" mt={1}>
              Collateral price unavailable. Please retry or choose another collateral asset.
            </Text>
          )}
        </FormControl>

        {amount && parseFloat(amount) > 0 && collateralPrice > 0 && (
          <Box bg="background.level1" borderRadius="md" p={4} w="full">
            <VStack align="stretch" spacing={2}>
              <Box>
                <Text color="font.secondary" fontSize="sm">
                  Required Collateral
                </Text>
                <Text fontSize="lg" fontWeight="semibold">
                  {requiredCollateral.toFixed(4)} {collateralSymbol || 'collateral'}
                </Text>
                <Text color="text.tertiary" fontSize="xs">
                  ≈ {requiredCollateralValueUsd.toFixed(2)} {assetSymbol || 'tokens'} based on{' '}
                  {formatPercentage(ltvDecimal)} LTV
                </Text>
              </Box>
              <Box mt={2}>
                <Text color="font.secondary" fontSize="sm">
                  Interest Cost
                </Text>
                <Text fontSize="lg" fontWeight="semibold">
                  {(parseFloat(amount) * baseRate).toFixed(2)} {assetSymbol || 'tokens'} / year
                </Text>
                <Text color="text.tertiary" fontSize="xs">
                  Based on current APY of {formatPercentage(baseRate)}
                </Text>
              </Box>
            </VStack>
          </Box>
        )}

        <Button
          isDisabled={
            !selectedCollateralId ||
            !amount ||
            parseFloat(amount) <= 0 ||
            collateralPrice <= 0 ||
            isPriceLoading ||
            parseFloat(amount) > availableBorrow
          }
          isLoading={isLoading}
          size="lg"
          type="submit"
          variant="primary"
          w="full"
        >
          Borrow
        </Button>
      </VStack>
    </Box>
  )
}
