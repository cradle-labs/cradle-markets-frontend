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
} from '@chakra-ui/react'
import { supplyLiquidity } from '@repo/lib/actions/lending'
import { toTokenDecimals } from './utils'

interface LendSupplyFormProps {
  poolId: string
  walletId?: string
  assetSymbol?: string
  supplyAPY: number
  onSuccess?: () => void
}

export function LendSupplyForm({
  poolId,
  walletId,
  assetSymbol,
  supplyAPY,
  onSuccess,
}: LendSupplyFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletId) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to supply liquidity',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
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

      const result = await supplyLiquidity({
        wallet: walletId,
        pool: poolId,
        amount: amountInDecimals,
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully supplied ${amount} ${assetSymbol || 'tokens'}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setAmount('')
        // Refetch transactions after successful supply
        onSuccess?.()
      } else {
        toast({
          title: 'Supply Failed',
          description: result.error || 'Failed to supply liquidity',
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
            Amount to Supply
          </FormLabel>
          <Input
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            size="lg"
            type="number"
            value={amount}
          />
          <FormHelperText color="text.tertiary" fontSize="xs">
            {assetSymbol && `Supply ${assetSymbol} to earn ${formatPercentage(supplyAPY)} APY`}
          </FormHelperText>
        </FormControl>

        {amount && parseFloat(amount) > 0 && (
          <Box bg="background.level1" borderRadius="md" p={4} w="full">
            <VStack align="stretch" spacing={2}>
              <Text color="font.secondary" fontSize="sm">
                Estimated Earnings
              </Text>
              <Text fontSize="lg" fontWeight="semibold">
                ${(parseFloat(amount) * supplyAPY).toFixed(2)} / year
              </Text>
              <Text color="text.tertiary" fontSize="xs">
                Based on current APY of {formatPercentage(supplyAPY)}
              </Text>
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
          {walletId ? 'Supply' : 'Connect Wallet'}
        </Button>
      </VStack>
    </Box>
  )
}
