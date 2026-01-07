'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
} from '@chakra-ui/react'
import { useListingFee } from '@repo/lib/cradle-client-ts/hooks/listings/useListings'
import { useAssetBalances } from '@repo/lib/cradle-client-ts/hooks/accounts/useAssetBalances'
import { purchaseListing } from '@repo/lib/actions/listings'
import { fromTokenDecimals, toTokenDecimals } from '@repo/lib/modules/lend/utils'

// Toggle to switch between API fee and fixed fee (set to true when API is fixed)
const USE_API_FEE = false
// Fallback fee rate of 5% (0.05) when API is not available
const FALLBACK_FEE_RATE = 0.05

interface ListingPurchasePanelProps {
  listingId: string
  walletId?: string
  assetSymbol?: string
  assetName?: string
  purchasePrice: string
  purchaseAssetId?: string
  purchaseAssetSymbol?: string
  purchaseAssetDecimals?: number
  status: string
  onPurchaseSuccess?: () => void
}

export function ListingPurchasePanel({
  listingId,
  walletId,
  assetSymbol,
  assetName,
  purchasePrice,
  purchaseAssetId,
  purchaseAssetSymbol = 'USD',
  purchaseAssetDecimals,
  status,
  onPurchaseSuccess,
}: ListingPurchasePanelProps) {
  const toast = useToast()
  const [amount, setAmount] = useState<string>('')
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Convert purchase price from purchase asset decimals to display value
  const normalizedPrice = fromTokenDecimals(parseFloat(purchasePrice), purchaseAssetDecimals ?? 6)

  // Fetch fee from API (only when USE_API_FEE is true)
  const { data: apiFee, isLoading: feeLoading } = useListingFee({
    listingId,
    amount: amount ? String(toTokenDecimals(parseFloat(amount))) : '0',
    enabled: USE_API_FEE && !!amount && parseFloat(amount) > 0,
  })

  // Calculate fee - uses API fee when available, otherwise uses fallback rate
  const calculateFee = () => {
    if (!amount || parseFloat(amount) <= 0) return 0

    // If API fee is enabled and available, use it
    if (USE_API_FEE && apiFee) {
      return fromTokenDecimals(apiFee)
    }

    // Otherwise, use fallback fixed rate
    const subtotal = parseFloat(amount) * normalizedPrice
    return subtotal * FALLBACK_FEE_RATE
  }

  // Fetch purchase asset balance (e.g., cpUSD)
  const purchaseAssetBalances = useAssetBalances({
    walletId: walletId || '',
    assetIds: purchaseAssetId ? [purchaseAssetId] : [],
    enabled: !!walletId && !!purchaseAssetId,
  })

  // Get the purchase asset balance and refetch function
  const purchaseAssetBalanceQuery = useMemo(() => {
    if (!purchaseAssetId || purchaseAssetBalances.length === 0) return null
    return purchaseAssetBalances.find(b => b.assetId === purchaseAssetId)
  }, [purchaseAssetId, purchaseAssetBalances])

  const purchaseAssetBalance = useMemo(() => {
    if (!purchaseAssetBalanceQuery?.data) return 0
    return fromTokenDecimals(
      purchaseAssetBalanceQuery.data.balance,
      purchaseAssetBalanceQuery.data.decimals
    )
  }, [purchaseAssetBalanceQuery])

  const refetchPurchaseAssetBalance = purchaseAssetBalanceQuery?.refetch

  const isDisabled = status !== 'open' || !walletId

  // Format price for display (already normalized)
  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
    const symbol = purchaseAssetSymbol ?? '$'
    const separator = symbol === '$' ? '' : ' '
    return `${symbol}${separator}${formatted}`
  }

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const calculateSubtotal = () => {
    if (!amount || parseFloat(amount) <= 0) return 0
    return parseFloat(amount) * normalizedPrice
  }

  const calculateTotal = () => {
    if (!amount || parseFloat(amount) <= 0) return 0
    const subtotal = calculateSubtotal()
    const feeAmount = calculateFee()
    return subtotal + feeAmount
  }

  // Check if user has insufficient funds
  const insufficientFunds = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return false
    const total = calculateTotal()
    return total > purchaseAssetBalance
  }, [amount, purchaseAssetBalance, normalizedPrice])

  const handlePurchase = async () => {
    if (!walletId || !amount) return

    setIsPurchasing(true)
    try {
      // Convert user input amount to 8 decimals for API
      const amountInDecimals = String(toTokenDecimals(parseFloat(amount)))

      const purchasePayload = {
        wallet: walletId,
        amount: amountInDecimals,
        listing: listingId,
      }

      // Console log the purchase payload
      console.log('[ListingPurchasePanel] Purchase Payload:', {
        ...purchasePayload,
        userInputAmount: parseFloat(amount),
        amountInDecimals,
        assetSymbol,
        purchaseAssetSymbol,
        normalizedPrice,
        totalCost: calculateTotal(),
      })

      const result = await purchaseListing(purchasePayload)

      console.log('[ListingPurchasePanel] Purchase Result:', result)

      if (result.success) {
        toast({
          title: 'Investment successful!',
          description: `You have successfully invested in ${amount} ${assetSymbol || 'tokens'}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setAmount('')

        // Refetch purchase asset balance (cpUSD)
        refetchPurchaseAssetBalance?.()

        // Call parent callback to refetch listing stats
        onPurchaseSuccess?.()
      } else {
        toast({
          title: 'Investment failed',
          description: result.error || 'An error occurred while processing your investment',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Investment failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <Card rounded="xl">
      <CardHeader pb={3}>
        <Text fontSize="lg" fontWeight="bold">
          Invest in {assetSymbol || 'Tokens'}
        </Text>
        {assetName && (
          <Text color="font.secondary" fontSize="sm">
            {assetName}
          </Text>
        )}
      </CardHeader>

      <CardBody pt={0}>
        <Box
          as="form"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault()
            handlePurchase()
          }}
          w="full"
        >
          <VStack spacing={4} w="full">
            {status !== 'open' && (
              <Alert borderRadius="md" status="info">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  This offering is currently {status} and not available for investment
                </AlertDescription>
              </Alert>
            )}

            {insufficientFunds && (
              <Alert borderRadius="md" status="warning">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Insufficient {purchaseAssetSymbol} balance. You need{' '}
                  {formatPrice(calculateTotal())} but only have {formatPrice(purchaseAssetBalance)}{' '}
                  available.
                </AlertDescription>
              </Alert>
            )}

            <FormControl isRequired>
              <HStack justify="space-between" mb={2}>
                <FormLabel color="font.secondary" fontSize="sm" fontWeight="medium" mb={0}>
                  Investment Amount
                </FormLabel>
                <Text color="text.tertiary" fontSize="xs">
                  {assetSymbol || 'tokens'}
                </Text>
              </HStack>
              <Input
                isDisabled={isDisabled}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                size="lg"
                step="0.01"
                type="number"
                value={amount}
              />
              <HStack justify="space-between" mt={2}>
                <FormHelperText color="text.tertiary" fontSize="xs" m={0}>
                  Price per token: {formatPrice(normalizedPrice)}
                </FormHelperText>
                {walletId && purchaseAssetBalance > 0 && (
                  <Text color="text.tertiary" fontSize="xs">
                    Balance: {formatAmount(purchaseAssetBalance)} {purchaseAssetSymbol}
                  </Text>
                )}
              </HStack>
            </FormControl>

            {amount && parseFloat(amount) > 0 && (
              <Box bg="background.level1" borderRadius="md" p={4} w="full">
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text color="font.secondary" fontSize="sm">
                      Subtotal
                    </Text>
                    <Text fontSize="lg" fontWeight="semibold">
                      {formatPrice(calculateSubtotal())}
                    </Text>
                    <Text color="text.tertiary" fontSize="xs">
                      {formatAmount(parseFloat(amount))} × {formatPrice(normalizedPrice)}
                    </Text>
                  </Box>

                  <Box>
                    <Text color="font.secondary" fontSize="sm">
                      Fee
                    </Text>
                    <Text fontSize="lg" fontWeight="semibold">
                      {USE_API_FEE && feeLoading ? 'Calculating...' : formatPrice(calculateFee())}
                    </Text>
                  </Box>

                  <Divider />

                  <Box>
                    <Text color="font.secondary" fontSize="sm">
                      Total Cost
                    </Text>
                    <Text fontSize="xl" fontWeight="bold">
                      {formatPrice(calculateTotal())}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            )}

            <Button
              isDisabled={isDisabled || !amount || parseFloat(amount) <= 0 || insufficientFunds}
              isLoading={isPurchasing}
              size="lg"
              type="submit"
              variant="primary"
              w="full"
            >
              {status !== 'open'
                ? 'Offering Not Available'
                : insufficientFunds
                  ? 'Insufficient Balance'
                  : 'Invest Now'}
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  )
}
