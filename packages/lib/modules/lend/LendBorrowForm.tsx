'use client'

import { useState } from 'react'
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
import { fromBasisPoints } from './utils'

interface LendBorrowFormProps {
  poolId: string
  walletId?: string
  assetSymbol?: string
  assetName?: string
  reserveAssetId: string
  borrowAPY: number
  loanToValue: string
}

export function LendBorrowForm({
  poolId,
  walletId,
  assetSymbol,
  assetName,
  reserveAssetId,
  borrowAPY,
  loanToValue,
}: LendBorrowFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? fromBasisPoints(value) : value
    return `${(numValue * 100).toFixed(2)}%`
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

    setIsLoading(true)

    try {
      const result = await borrowAsset({
        wallet: walletId,
        pool: poolId,
        amount: parseFloat(amount),
        collateral: reserveAssetId,
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully borrowed ${amount} ${assetSymbol || 'tokens'}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setAmount('')
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
          <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium">
            Amount to Borrow
          </FormLabel>
          <Input
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            size="lg"
            step="0.01"
            type="number"
            value={amount}
          />
          <FormHelperText color="text.tertiary" fontSize="xs">
            Borrow {assetSymbol} at {formatPercentage(borrowAPY)} APY
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
          isDisabled={!walletId || !amount || parseFloat(amount) <= 0}
          isLoading={isLoading}
          size="lg"
          type="submit"
          variant="primary"
          w="full"
        >
          {walletId ? 'Borrow' : 'Connect Wallet'}
        </Button>
      </VStack>
    </Box>
  )
}
