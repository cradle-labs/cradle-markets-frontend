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
import { supplyLiquidity } from '@repo/lib/actions/lending'
import { useAssetBalances } from '@repo/lib/cradle-client-ts/hooks/accounts/useAssetBalances'
import { toTokenDecimals, fromTokenDecimals } from './utils'

interface LendSupplyFormProps {
  poolId: string
  walletId?: string
  assetSymbol?: string
  reserveAssetId?: string
  supplyAPY: number
  onSuccess?: () => void
}

export function LendSupplyForm({
  poolId,
  walletId,
  assetSymbol,
  reserveAssetId,
  supplyAPY,
  onSuccess,
}: LendSupplyFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // Fetch balance for the reserve asset using useAssetBalances
  const assetIds = useMemo(() => {
    return reserveAssetId ? [reserveAssetId] : []
  }, [reserveAssetId])

  const assetBalances = useAssetBalances({
    walletId: walletId || '',
    assetIds,
    enabled: !!walletId && assetIds.length > 0,
  })

  // Extract and format balance for the reserve asset
  const balanceData = useMemo(() => {
    const balance = assetBalances.find(b => b.assetId === reserveAssetId)
    if (!balance?.data) return null
    const normalized = fromTokenDecimals(balance.data.balance, balance.data.decimals)
    return {
      formatted: new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(normalized),
      balance: normalized,
      decimals: balance.data.decimals,
    }
  }, [assetBalances, reserveAssetId])

  const balance = balanceData?.balance ?? 0

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const handleMaxClick = () => {
    if (balance > 0) {
      setAmount(balance.toFixed(4))
    }
  }

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
      // Convert normalized amount to token decimals using actual asset decimals
      // User enters "1.5", backend needs the scaled amount
      const assetDecimals = balanceData?.decimals ?? 8
      const amountInDecimals = toTokenDecimals(parseFloat(amount), assetDecimals)

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
        // Refetch asset balances after successful supply
        assetBalances.forEach(balance => balance.refetch())
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
          <HStack justify="space-between" mb={2}>
            <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium" mb={0}>
              Amount to Supply
            </FormLabel>
            {walletId && reserveAssetId && (
              <HStack spacing={2}>
                <Text color="text.tertiary" fontSize="xs">
                  Balance: {balanceData?.formatted || '0.00'} {assetSymbol || ''}
                </Text>
                {balance > 0 && (
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
          isDisabled={!amount || parseFloat(amount) <= 0}
          isLoading={isLoading}
          size="lg"
          type="submit"
          variant="primary"
          w="full"
        >
          Supply
        </Button>
      </VStack>
    </Box>
  )
}
