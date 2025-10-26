'use client'

import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { ArrowDown } from 'react-feather'
import { IconButton } from '@chakra-ui/react'
import { TokenInput } from '@repo/lib/modules/tokens/TokenInput/TokenInput'
import { ConnectWallet } from '@repo/lib/modules/web3/ConnectWallet'
import { useState } from 'react'
import { HumanAmount } from '@balancer/sdk'

export function AssetBuyForm() {
  const [payAmount, setPayAmount] = useState<HumanAmount>('0' as HumanAmount)
  const [receiveAmount, setReceiveAmount] = useState<HumanAmount>('0' as HumanAmount)

  // Mock rate - in a real app this would come from the API
  const rate = 192.23 // 1 NVDAon = $192.23 USDC

  const handlePayAmountChange = (e: any) => {
    const value = (e?.currentTarget?.value || e?.target?.value || '') as HumanAmount
    setPayAmount(value)
    
    // Calculate receive amount based on rate
    if (value && !isNaN(Number(value))) {
      const calculatedReceive = (Number(value) / rate).toString()
      setReceiveAmount(calculatedReceive as HumanAmount)
    } else {
      setReceiveAmount('0' as HumanAmount)
    }
  }

  const handleReceiveAmountChange = (e: any) => {
    const value = (e?.currentTarget?.value || e?.target?.value || '') as HumanAmount
    setReceiveAmount(value)
    
    // Calculate pay amount based on rate
    if (value && !isNaN(Number(value))) {
      const calculatedPay = (Number(value) * rate).toString()
      setPayAmount(calculatedPay as HumanAmount)
    } else {
      setPayAmount('0' as HumanAmount)
    }
  }

  return (
    <VStack spacing={4} w="full">
      {/* Pay Section */}
      <VStack align="start" spacing={2} w="full">
        <Text color="font.secondary" fontSize="sm" fontWeight="medium">
          Pay
        </Text>
        <Box w="full">
          <TokenInput
            address="0xA0b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B"
            apiToken={{
              address: "0xA0b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B",
              chain: "ETHEREUM",
              decimals: 6,
              logoURI: "/images/tokens/usdc.svg",
              name: "USD Coin",
              symbol: "USDC",
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
        <Text color="font.secondary" fontSize="sm" fontWeight="medium">
          Receive
        </Text>
        <Box w="full">
          <TokenInput
            address="0xB1b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B"
            apiToken={{
              address: "0xB1b86a33E6441b8c4C8C0d4B0cF4B4F4B4F4B4F4B",
              chain: "ETHEREUM",
              decimals: 18,
              logoURI: "/images/tokens/nvidia.svg",
              name: "NVIDIA Tokenized",
              symbol: "NVDAon",
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
            1 NVDAon = {rate} USDC (${rate.toFixed(2)})
          </Text>
        </HStack>
        
        <HStack justify="space-between" w="full">
          <HStack spacing={1}>
            <Text color="font.secondary" fontSize="sm">
              Shares Per Token
            </Text>
            <Box color="font.secondary" fontSize="xs">
              ?
            </Box>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">
            1 NVDAon = 1.00 NVDA
          </Text>
        </HStack>
      </VStack>

      {/* Action Button */}
      <ConnectWallet
        connectLabel="Sign In to Continue"
        size="lg"
        variant="primary"
        w="full"
      />

      {/* Waitlist Text */}
      <Text color="font.secondary" fontSize="xs" textAlign="center">
        Join the waitlist after signing up to be among the first to experience the platform.
      </Text>
    </VStack>
  )
}
