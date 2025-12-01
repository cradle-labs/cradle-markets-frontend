'use client'

import { Box, Button, HStack, Input, Text, VStack, useToast } from '@chakra-ui/react'
import { ArrowDown } from 'react-feather'
import { IconButton } from '@chakra-ui/react'
import { TokenInput } from '@repo/lib/modules/tokens/TokenInput/TokenInput'
import { useState, useEffect } from 'react'
import { HumanAmount } from '@balancer/sdk'
import { useAssetDetail } from './AssetDetailProvider'
import { useHederaBalance } from '@repo/lib/shared/hooks/useHederaBalance'
import { useUser } from '@clerk/nextjs'
import { useAccountByLinkedId } from '@repo/lib/cradle-client-ts/hooks/accounts/useAccountByLinkedId'
import { useWalletByAccountId } from '@repo/lib/cradle-client-ts/hooks/accounts/useWallet'
import { useAsset } from '@repo/lib/cradle-client-ts/hooks/assets/useAsset'
import { placeOrder } from '@repo/lib/actions/orders'
import {
  blockInvalidNumberInput,
  formatTo8Decimals,
  formatToWholeNumber,
} from '@repo/lib/shared/utils/numbers'
import type { FillMode } from '@repo/lib/cradle-client-ts/cradle-api-client'

type OrderType = 'market' | 'limit'

interface PlaceOrderInput {
  wallet: string
  market_id: string
  bid_asset: string
  ask_asset: string
  bid_amount: string
  ask_amount: string
  price: string
  mode: FillMode
  order_type: OrderType
}

export function AssetSellForm() {
  const { user } = useUser()
  const toast = useToast()
  const { market, refetch, asset } = useAssetDetail()

  // Calculate current market price from asset data
  const currentMarketPrice = asset?.currentPrice || 1.0

  // State
  const [sellAmount, setSellAmount] = useState<HumanAmount>('0' as HumanAmount)
  const [receiveAmount, setReceiveAmount] = useState<HumanAmount>('0' as HumanAmount)
  const [orderType, setOrderType] = useState<OrderType>('market')
  const [fillMode, setFillMode] = useState<FillMode>('good-till-cancel')
  const [limitPrice, setLimitPrice] = useState<string>(currentMarketPrice.toFixed(4))
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update limit price when market price changes
  useEffect(() => {
    if (currentMarketPrice && !limitPrice) {
      setLimitPrice(currentMarketPrice.toFixed(4))
    }
  }, [currentMarketPrice])

  // Get user's Cradle account and wallet
  const { data: linkedAccount } = useAccountByLinkedId({
    enabled: !!user?.id,
    linkedAccountId: user?.id || '',
  })

  const { data: wallet } = useWalletByAccountId({
    accountId: linkedAccount?.id || '',
    enabled: !!linkedAccount?.id,
  })

  // Fetch asset_one (the asset we're selling, e.g., SAF) using its ID
  const { data: assetOne } = useAsset({
    assetId: market?.asset_one || '',
    enabled: !!market?.asset_one,
  })

  // Fetch asset_two (the asset we're receiving, e.g., cpUSD) using its ID
  const { data: assetTwo } = useAsset({
    assetId: market?.asset_two || '',
    enabled: !!market?.asset_two,
  })

  // Format addresses to ensure they have 0x prefix (for display purposes)
  const formatAddress = (address: string | undefined) => {
    if (!address) return undefined
    return address.toLowerCase().startsWith('0x')
      ? (address as `0x${string}`)
      : (`0x${address}` as `0x${string}`)
  }

  // Fetch balance for asset_one (the asset we're selling, e.g., SAF)
  const { data: sellAssetBalance } = useHederaBalance({
    accountId: wallet?.contract_id, // Use contract_id which is in Hedera format (0.0.XXXXX)
    tokenId: assetOne?.token, // Token ID in hex format
    enabled: !!wallet?.contract_id && !!assetOne?.token,
  })

  // Fetch balance for asset_two (the asset we're receiving, e.g., cpUSD)
  const { data: receiveAssetBalance } = useHederaBalance({
    accountId: wallet?.contract_id, // Use contract_id which is in Hedera format (0.0.XXXXX)
    tokenId: assetTwo?.token, // Token ID in hex format
    enabled: !!wallet?.contract_id && !!assetTwo?.token,
  })

  // Calculate price based on order type
  const getPrice = () => {
    if (orderType === 'limit' && limitPrice) {
      return limitPrice
    }
    // For market orders, use current market price
    return currentMarketPrice.toFixed(4)
  }

  const handleSellAmountChange = (e: any) => {
    const value = (e?.currentTarget?.value || e?.target?.value || '') as HumanAmount
    setSellAmount(value)

    // Calculate receive amount based on price
    if (value && !isNaN(Number(value))) {
      const price = Number(getPrice())
      const calculatedReceive = (Number(value) * price).toFixed(4)
      setReceiveAmount(calculatedReceive as HumanAmount)
    } else {
      setReceiveAmount('0' as HumanAmount)
    }
  }

  const handleReceiveAmountChange = (e: any) => {
    const value = (e?.currentTarget?.value || e?.target?.value || '') as HumanAmount
    setReceiveAmount(value)

    // Calculate sell amount based on price
    if (value && !isNaN(Number(value))) {
      const price = Number(getPrice())
      if (price > 0) {
        const calculatedSell = (Number(value) / price).toFixed(4)
        setSellAmount(calculatedSell as HumanAmount)
      }
    } else {
      setSellAmount('0' as HumanAmount)
    }
  }

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitPrice(e.target.value)
    // Recalculate amounts when price changes
    if (sellAmount && Number(sellAmount) > 0 && e.target.value) {
      const calculatedReceive = (Number(sellAmount) * Number(e.target.value)).toFixed(4)
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

    if (!sellAmount || Number(sellAmount) <= 0) {
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

      // Format amounts: whole numbers for amounts, 8 decimals for price
      const orderPayload: PlaceOrderInput = {
        wallet: wallet.id,
        market_id: market.id,
        bid_asset: assetTwo.id, //  bid asset is the one you want and are gonna be receiving.
        ask_asset: assetOne.id, // ask asset is the one you have and are gonna be paying with.
        bid_amount: formatToWholeNumber(receiveAmount), // bid amount is the amount you want to receive (whole number)
        ask_amount: formatToWholeNumber(sellAmount), //ask amount is the amount you have and are gonna be paying with (whole number)
        price: formatTo8Decimals(price), // Price in 8 decimal format
        mode: fillMode,
        order_type: orderType,
      }

      console.log('=== Order Placement Debug (SELL) ===')
      console.log('User Input - Sell Amount:', sellAmount)
      console.log('User Input - Receive Amount:', receiveAmount)
      console.log('User Input - Price:', price)
      console.log('Formatted - bid_amount:', formatToWholeNumber(receiveAmount))
      console.log('Formatted - ask_amount:', formatToWholeNumber(sellAmount))
      console.log('Formatted - price:', formatTo8Decimals(price))
      console.log('Wallet:', wallet)
      console.log('Market:', market)
      console.log('Asset One (selling):', assetOne)
      console.log('Asset Two (receiving):', assetTwo)
      console.log('Order Payload:', orderPayload)

      const result = await placeOrder(orderPayload)

      console.log('Order Result:', result)

      if (result.success) {
        toast({
          title: 'Order Placed',
          description: `Successfully placed ${orderType} order`,
          status: 'success',
          duration: 5000,
        })

        // Reset form
        setSellAmount('0' as HumanAmount)
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

      {/* Fill Mode Selector */}
      <VStack align="start" spacing={2} w="full">
        <Text color="font.secondary" fontSize="sm" fontWeight="medium">
          Fill Mode
        </Text>
        <HStack spacing={2} w="full">
          <Button
            _hover={{
              bg: fillMode === 'good-till-cancel' ? 'background.level1' : 'background.level0',
            }}
            bg={fillMode === 'good-till-cancel' ? 'background.level1' : 'transparent'}
            border="1px solid"
            borderColor={fillMode === 'good-till-cancel' ? 'border.accent' : 'border.base'}
            flex={1}
            onClick={() => setFillMode('good-till-cancel')}
            size="sm"
            variant="outline"
          >
            <VStack spacing={0}>
              <Text fontSize="xs" fontWeight="semibold">
                GTC
              </Text>
              <Text color="font.secondary" fontSize="2xs">
                Good Till Cancel
              </Text>
            </VStack>
          </Button>
          <Button
            _hover={{
              bg: fillMode === 'immediate-or-cancel' ? 'background.level1' : 'background.level0',
            }}
            bg={fillMode === 'immediate-or-cancel' ? 'background.level1' : 'transparent'}
            border="1px solid"
            borderColor={fillMode === 'immediate-or-cancel' ? 'border.accent' : 'border.base'}
            flex={1}
            onClick={() => setFillMode('immediate-or-cancel')}
            size="sm"
            variant="outline"
          >
            <VStack spacing={0}>
              <Text fontSize="xs" fontWeight="semibold">
                IOC
              </Text>
              <Text color="font.secondary" fontSize="2xs">
                Immediate or Cancel
              </Text>
            </VStack>
          </Button>
          <Button
            _hover={{
              bg: fillMode === 'fill-or-kill' ? 'background.level1' : 'background.level0',
            }}
            bg={fillMode === 'fill-or-kill' ? 'background.level1' : 'transparent'}
            border="1px solid"
            borderColor={fillMode === 'fill-or-kill' ? 'border.accent' : 'border.base'}
            flex={1}
            onClick={() => setFillMode('fill-or-kill')}
            size="sm"
            variant="outline"
          >
            <VStack spacing={0}>
              <Text fontSize="xs" fontWeight="semibold">
                FOK
              </Text>
              <Text color="font.secondary" fontSize="2xs">
                Fill or Kill
              </Text>
            </VStack>
          </Button>
        </HStack>
        <Text color="font.secondary" fontSize="2xs">
          {fillMode === 'good-till-cancel' && 'Order stays active until filled or cancelled'}
          {fillMode === 'immediate-or-cancel' && 'Fill available amount immediately, cancel rest'}
          {fillMode === 'fill-or-kill' && 'Fill entire order immediately or cancel all'}
        </Text>
      </VStack>

      {/* Limit Price Input (only for limit orders) */}
      {orderType === 'limit' && (
        <VStack align="start" spacing={2} w="full">
          <Text color="font.secondary" fontSize="sm" fontWeight="medium">
            Limit Price
          </Text>
          <Box
            bg="background.level0"
            borderRadius="md"
            p={['ms', 'md']}
            shadow="innerBase"
            w="full"
          >
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
                  onChange={handleLimitPriceChange}
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
                  value={limitPrice}
                />
                <Text color="font.primary" fontSize="xl" fontWeight="bold">
                  {assetTwo?.symbol || 'USD'}
                </Text>
              </HStack>

              <HStack justify="space-between" w="full">
                <Text color="font.secondary" fontSize="xs">
                  Price per {assetOne?.symbol || 'token'}
                </Text>
                <Text color="font.secondary" fontSize="xs">
                  Market: {currentMarketPrice.toFixed(4)} {assetTwo?.symbol || 'USD'}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      )}

      {/* Sell Section */}
      <VStack align="start" spacing={2} w="full">
        <HStack justify="space-between" w="full">
          <Text color="font.secondary" fontSize="sm" fontWeight="medium">
            Sell
          </Text>
          <Text color="font.secondary" fontSize="xs">
            Balance: {sellAssetBalance?.formatted || '0'} {assetOne?.symbol}
          </Text>
        </HStack>
        <Box w="full">
          <TokenInput
            address={formatAddress(assetOne?.token) || '0x0'}
            apiToken={{
              address: formatAddress(assetOne?.token) || '0x0',
              chain: 'ETHEREUM',
              decimals: assetOne?.decimals || 18,
              logoURI: assetOne?.icon || '/images/tokens/default.svg',
              name: assetOne?.name || 'Unknown',
              symbol: assetOne?.symbol || 'TOKEN',
            }}
            chain="ETHEREUM"
            customUsdPrice={currentMarketPrice}
            customUserBalance={sellAssetBalance?.formatted}
            onChange={handleSellAmountChange}
            placeholder="0.00"
            value={sellAmount}
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
          <Text color="font.secondary" fontSize="xs">
            Balance: {receiveAssetBalance?.formatted || '0'} {assetTwo?.symbol}
          </Text>
        </HStack>
        <Box w="full">
          <TokenInput
            address={formatAddress(assetTwo?.token) || '0x0'}
            apiToken={{
              address: formatAddress(assetTwo?.token) || '0x0',
              chain: 'ETHEREUM',
              decimals: assetTwo?.decimals || 18,
              logoURI: assetTwo?.icon || '/images/tokens/default.svg',
              name: assetTwo?.name || 'Unknown',
              symbol: assetTwo?.symbol || 'TOKEN',
            }}
            chain="ETHEREUM"
            customUsdPrice={1} // Assuming stable coin, adjust if needed
            customUserBalance={receiveAssetBalance?.formatted}
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
      <Button
        isDisabled={!market || !assetOne || !assetTwo || Number(sellAmount) <= 0}
        isLoading={isSubmitting}
        onClick={handleSubmitOrder}
        size="lg"
        variant="primary"
        w="full"
      >
        {orderType === 'market' ? 'Sell at Market' : 'Place Limit Order'}
      </Button>
    </VStack>
  )
}
