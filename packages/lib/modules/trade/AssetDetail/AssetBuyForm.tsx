'use client'

import { Box, Button, HStack, Text, VStack, useToast } from '@chakra-ui/react'
import { ArrowDown } from 'react-feather'
import { IconButton } from '@chakra-ui/react'
import { TokenInput } from '@repo/lib/modules/tokens/TokenInput/TokenInput'
import { ConnectWallet } from '@repo/lib/modules/web3/ConnectWallet'
import { useState } from 'react'
import { HumanAmount } from '@balancer/sdk'
import { useAssetDetail } from './AssetDetailProvider'
import { useBalance } from '@repo/lib/shared/utils/wagmi'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { placeOrder } from '@repo/lib/actions/orders'

type OrderType = 'market' | 'limit'

export function AssetBuyForm() {
  const { user } = useUser()
  const toast = useToast()
  const { market, assetOne, assetTwo, refetch } = useAssetDetail()

  // State
  const [payAmount, setPayAmount] = useState<HumanAmount>('0' as HumanAmount)
  const [receiveAmount, setReceiveAmount] = useState<HumanAmount>('0' as HumanAmount)
  const [orderType, setOrderType] = useState<OrderType>('market')
  const [limitPrice, setLimitPrice] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get user's Cradle account and wallet
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  const { data: wallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  // Format token addresses to ensure they have 0x prefix
  const formatTokenAddress = (token: string | undefined) => {
    if (!token) return undefined
    return token.toLowerCase().startsWith('0x')
      ? (token as `0x${string}`)
      : (`0x${token}` as `0x${string}`)
  }

  // Fetch balance for asset_two (the asset we're paying with, e.g., cpUSD)
  const { data: payAssetBalance } = useBalance({
    address: wallet?.address as `0x${string}`,
    token: formatTokenAddress(assetTwo?.token),
    query: {
      enabled: !!wallet?.address && !!assetTwo?.token,
      refetchInterval: 30000,
    },
  })

  // Fetch balance for asset_one (the asset we're receiving, e.g., SAF)
  const { data: receiveAssetBalance } = useBalance({
    address: wallet?.address as `0x${string}`,
    token: formatTokenAddress(assetOne?.token),
    query: {
      enabled: !!wallet?.address && !!assetOne?.token,
      refetchInterval: 30000,
    },
  })

  // Calculate price based on order type
  const getPrice = () => {
    if (orderType === 'limit' && limitPrice) {
      return limitPrice
    }
    // For market orders, use current market price or 1:1 ratio as fallback
    // In production, this should come from the order book or market data
    return '1.00'
  }

  const handlePayAmountChange = (e: any) => {
    const value = (e?.currentTarget?.value || e?.target?.value || '') as HumanAmount
    setPayAmount(value)

    // Calculate receive amount based on price
    if (value && !isNaN(Number(value))) {
      const price = Number(getPrice())
      if (price > 0) {
        const calculatedReceive = (Number(value) / price).toString()
        setReceiveAmount(calculatedReceive as HumanAmount)
      }
    } else {
      setReceiveAmount('0' as HumanAmount)
    }
  }

  const handleReceiveAmountChange = (e: any) => {
    const value = (e?.currentTarget?.value || e?.target?.value || '') as HumanAmount
    setReceiveAmount(value)

    // Calculate pay amount based on price
    if (value && !isNaN(Number(value))) {
      const price = Number(getPrice())
      const calculatedPay = (Number(value) * price).toString()
      setPayAmount(calculatedPay as HumanAmount)
    } else {
      setPayAmount('0' as HumanAmount)
    }
  }

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitPrice(e.target.value)
    // Recalculate amounts when price changes
    if (payAmount && Number(payAmount) > 0 && e.target.value) {
      const calculatedReceive = (Number(payAmount) / Number(e.target.value)).toString()
      setReceiveAmount(calculatedReceive as HumanAmount)
    }
  }

  const handleSubmitOrder = async () => {
    if (!wallet || !market || !assetOne || !assetTwo) {
      toast({
        title: 'Error',
        description: 'Missing required data. Please try again.',
        status: 'error',
        duration: 5000,
      })
      return
    }

    if (!payAmount || Number(payAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount.',
        status: 'error',
        duration: 5000,
      })
      return
    }

    if (orderType === 'limit' && (!limitPrice || Number(limitPrice) <= 0)) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid limit price.',
        status: 'error',
        duration: 5000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const price = getPrice()

      const result = await placeOrder({
        wallet: wallet.id,
        market_id: market.id,
        bid_asset: assetOne.id, // We want to receive asset_one (SAF)
        ask_asset: assetTwo.id, // We're paying with asset_two (cpUSD)
        bid_amount: receiveAmount, // Amount we want to receive
        ask_amount: payAmount, // Amount we're paying
        price,
        mode: 'good-till-cancel',
        order_type: orderType,
      })

      if (result.success) {
        toast({
          title: 'Order Placed',
          description: `Successfully placed ${orderType} order`,
          status: 'success',
          duration: 5000,
        })

        // Reset form
        setPayAmount('0' as HumanAmount)
        setReceiveAmount('0' as HumanAmount)
        setLimitPrice('')

        // Refetch data
        refetch()
      } else {
        toast({
          title: 'Order Failed',
          description: result.error || 'Failed to place order',
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isConnected = !!wallet

  return (
    <VStack spacing={4} w="full">
      {/* Order Type Selector */}
      <HStack borderBottom="1px solid" borderColor="border.base" spacing={0} w="full">
        <Button
          _after={
            orderType === 'market'
              ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(to right, #3F5EFB, #FC466B)',
                }
              : undefined
          }
          _hover={{
            bg: 'transparent',
            color: 'font.primary',
          }}
          color={orderType === 'market' ? 'font.primary' : 'font.secondary'}
          flex={1}
          fontWeight={orderType === 'market' ? 'semibold' : 'medium'}
          onClick={() => setOrderType('market')}
          pb={3}
          position="relative"
          pt={3}
          px={6}
          rounded="none"
          variant="ghost"
        >
          Market
        </Button>
        <Button
          _after={
            orderType === 'limit'
              ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(to right, #3F5EFB, #FC466B)',
                }
              : undefined
          }
          _hover={{
            bg: 'transparent',
            color: 'font.primary',
          }}
          color={orderType === 'limit' ? 'font.primary' : 'font.secondary'}
          flex={1}
          fontWeight={orderType === 'limit' ? 'semibold' : 'medium'}
          onClick={() => setOrderType('limit')}
          pb={3}
          position="relative"
          pt={3}
          px={6}
          rounded="none"
          variant="ghost"
        >
          Limit
        </Button>
      </HStack>

      {/* Limit Price Input (only for limit orders) */}
      {orderType === 'limit' && (
        <VStack align="start" spacing={2} w="full">
          <Text color="font.secondary" fontSize="sm" fontWeight="medium">
            Limit Price
          </Text>
          <Box w="full">
            <input
              onChange={handleLimitPriceChange}
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '16px',
              }}
              type="number"
              value={limitPrice}
            />
          </Box>
          <Text color="font.secondary" fontSize="xs">
            Price per {assetOne?.symbol || 'token'}
          </Text>
        </VStack>
      )}

      {/* Pay Section */}
      <VStack align="start" spacing={2} w="full">
        <HStack justify="space-between" w="full">
          <Text color="font.secondary" fontSize="sm" fontWeight="medium">
            Pay
          </Text>
          {isConnected && (
            <Text color="font.secondary" fontSize="xs">
              Balance: {payAssetBalance?.formatted || '0'} {assetTwo?.symbol}
            </Text>
          )}
        </HStack>
        <Box w="full">
          <TokenInput
            address={formatTokenAddress(assetTwo?.token) || '0x0'}
            apiToken={{
              address: formatTokenAddress(assetTwo?.token) || '0x0',
              chain: 'ETHEREUM',
              decimals: assetTwo?.decimals || 18,
              logoURI: assetTwo?.icon || '/images/tokens/default.svg',
              name: assetTwo?.name || 'Unknown',
              symbol: assetTwo?.symbol || 'TOKEN',
            }}
            chain="ETHEREUM"
            onChange={handlePayAmountChange}
            placeholder="0.00"
            value={payAmount}
          />
        </Box>
      </VStack>

      {/* Arrow */}
      <Box display="flex" justifyContent="center" position="relative" w="full">
        <IconButton
          aria-label="Switch direction"
          icon={<ArrowDown size={16} />}
          isRound
          position="absolute"
          size="sm"
          top="-16px"
          variant="tertiary"
          zIndex={1}
        />
      </Box>

      {/* Receive Section */}
      <VStack align="start" spacing={2} w="full">
        <HStack justify="space-between" w="full">
          <Text color="font.secondary" fontSize="sm" fontWeight="medium">
            Receive
          </Text>
          {isConnected && (
            <Text color="font.secondary" fontSize="xs">
              Balance: {receiveAssetBalance?.formatted || '0'} {assetOne?.symbol}
            </Text>
          )}
        </HStack>
        <Box w="full">
          <TokenInput
            address={formatTokenAddress(assetOne?.token) || '0x0'}
            apiToken={{
              address: formatTokenAddress(assetOne?.token) || '0x0',
              chain: 'ETHEREUM',
              decimals: assetOne?.decimals || 18,
              logoURI: assetOne?.icon || '/images/tokens/default.svg',
              name: assetOne?.name || 'Unknown',
              symbol: assetOne?.symbol || 'TOKEN',
            }}
            chain="ETHEREUM"
            onChange={handleReceiveAmountChange}
            placeholder="0.00"
            value={receiveAmount}
          />
        </Box>
      </VStack>

      {/* Rate Information */}
      <VStack align="start" spacing={2} w="full">
        <HStack justify="space-between" w="full">
          <Text color="font.secondary" fontSize="sm">
            Rate
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            1 {assetOne?.symbol} = {getPrice()} {assetTwo?.symbol}
          </Text>
        </HStack>

        <HStack justify="space-between" w="full">
          <Text color="font.secondary" fontSize="sm">
            Market
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {market?.name || 'N/A'}
          </Text>
        </HStack>
      </VStack>

      {/* Action Button */}
      {!isConnected ? (
        <ConnectWallet connectLabel="Sign In to Continue" size="lg" variant="primary" w="full" />
      ) : (
        <Button
          isDisabled={!market || !assetOne || !assetTwo || Number(payAmount) <= 0}
          isLoading={isSubmitting}
          onClick={handleSubmitOrder}
          size="lg"
          variant="primary"
          w="full"
        >
          {orderType === 'market' ? 'Buy at Market' : 'Place Limit Order'}
        </Button>
      )}
    </VStack>
  )
}
