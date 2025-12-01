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
  Badge,
} from '@chakra-ui/react'
import { borrowAsset } from '@repo/lib/actions/lending'
import { useDepositPosition } from '@repo/lib/cradle-client-ts/hooks/lending/useLendingPool'
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
  borrowAPY: number
  loanToValue: string
  onSuccess?: () => void
}

export function LendBorrowForm({
  poolId,
  walletId,
  assetSymbol,
  assetName,
  reserveAssetId,
  borrowAPY,
  loanToValue,
  onSuccess,
}: LendBorrowFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // Fetch deposit position to get supplied amount
  const { data: depositPosition, refetch: refetchDepositPosition } = useDepositPosition({
    poolId,
    walletId: walletId || '',
    enabled: !!walletId && !!poolId,
  })

  // Extract supplied amount from deposit position
  // Use underlying_value as it represents the actual value of the deposit
  const suppliedAmount = useMemo(() => {
    if (!depositPosition) return 0

    const position = depositPosition as DepositPosition
    // Use underlying_value as the supplied amount (represents the actual deposit value)
    const amount = position.underlying_value ?? position.yield_token_balance ?? 0

    // Convert from token decimals to normalized form
    if (typeof amount === 'string' || typeof amount === 'number') {
      return fromTokenDecimals(Number(amount))
    }
    return 0
  }, [depositPosition])

  // Calculate available borrow amount
  // Available borrow = (supplied amount * LTV) - already borrowed
  const availableBorrow = useMemo(() => {
    if (suppliedAmount <= 0) return 0

    const ltv = fromBasisPoints(loanToValue)
    const maxBorrowable = suppliedAmount * ltv

    // If deposit position has borrowed amount, subtract it
    const position = depositPosition as DepositPosition | undefined
    const borrowed =
      position?.borrowed || position?.borrowed_amount
        ? fromTokenDecimals(Number(position.borrowed || position.borrowed_amount || 0))
        : 0

    return Math.max(0, maxBorrowable - borrowed)
  }, [suppliedAmount, loanToValue, depositPosition])

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? fromBasisPoints(value) : value
    return `${(numValue * 100).toFixed(2)}%`
  }

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const handleMaxClick = () => {
    if (availableBorrow > 0) {
      setAmount(availableBorrow.toFixed(4))
    }
  }

  const calculateRequiredCollateral = () => {
    if (!amount || parseFloat(amount) <= 0) return 0
    // Convert LTV from basis points to decimal
    const ltv = fromBasisPoints(loanToValue)
    // Required collateral = borrow amount / LTV
    return parseFloat(amount) / ltv
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletId) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to borrow',
        status: 'warning',
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
    if (depositPosition && parseFloat(amount) > availableBorrow) {
      toast({
        title: 'Insufficient Collateral',
        description: `You can only borrow up to ${formatAmount(availableBorrow)} ${assetSymbol || 'tokens'} based on your supplied collateral`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      // Convert normalized amount to token decimals (8 decimals)
      // User enters "1.5", backend needs "150000000"
      const amountInDecimals = toTokenDecimals(parseFloat(amount))

      const borrowAssetPayload = {
        wallet: walletId,
        pool: poolId,
        amount: amountInDecimals,
        collateral: reserveAssetId,
      }

      console.log('Borrow Asset Payload:', borrowAssetPayload)

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
        <FormControl>
          <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium">
            Collateral
          </FormLabel>
          <Box
            bg="background.level1"
            border="1px solid"
            borderColor="border.base"
            borderRadius="md"
            p={4}
          >
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                {assetName || assetSymbol}
              </Text>
              <Badge colorScheme="blue">{assetSymbol}</Badge>
            </HStack>
          </Box>
          <FormHelperText color="text.tertiary" fontSize="xs">
            You must have supplied {assetSymbol} to borrow against it
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <HStack justify="space-between" mb={2}>
            <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium" mb={0}>
              Amount to Borrow
            </FormLabel>
            {walletId && suppliedAmount > 0 && (
              <HStack spacing={2}>
                <Text color="text.tertiary" fontSize="xs">
                  Available: {formatAmount(availableBorrow)} {assetSymbol || ''}
                </Text>
                {availableBorrow > 0 && (
                  <Button colorScheme="blue" onClick={handleMaxClick} size="xs" variant="ghost">
                    Max
                  </Button>
                )}
              </HStack>
            )}
          </HStack>
          <Input
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            size="lg"
            step="0.01"
            type="number"
            value={amount}
          />
          <FormHelperText color="text.tertiary" fontSize="xs">
            {walletId && suppliedAmount > 0
              ? `You can borrow up to ${formatAmount(availableBorrow)} ${assetSymbol} based on your supplied collateral`
              : `Borrow ${assetSymbol} at ${formatPercentage(borrowAPY)} APY`}
          </FormHelperText>
        </FormControl>

        {amount && parseFloat(amount) > 0 && (
          <Box bg="background.level1" borderRadius="md" p={4} w="full">
            <VStack align="stretch" spacing={2}>
              <Box>
                <Text color="font.secondary" fontSize="sm">
                  Required Collateral
                </Text>
                <Text fontSize="lg" fontWeight="semibold">
                  ${calculateRequiredCollateral().toFixed(2)}
                </Text>
                <Text color="text.tertiary" fontSize="xs">
                  Based on {formatPercentage(loanToValue)} LTV
                </Text>
              </Box>
              <Box mt={2}>
                <Text color="font.secondary" fontSize="sm">
                  Interest Cost
                </Text>
                <Text fontSize="lg" fontWeight="semibold">
                  ${(parseFloat(amount) * borrowAPY).toFixed(2)} / year
                </Text>
                <Text color="text.tertiary" fontSize="xs">
                  Based on current APY of {formatPercentage(borrowAPY)}
                </Text>
              </Box>
            </VStack>
          </Box>
        )}

        <Button
          isDisabled={
            !amount ||
            parseFloat(amount) <= 0 ||
            (depositPosition && parseFloat(amount) > availableBorrow)
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
