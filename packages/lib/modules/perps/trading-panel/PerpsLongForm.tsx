'use client'

import { useState } from 'react'
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react'

export function PerpsBuyForm() {
  const [amount, setAmount] = useState('100')
  const [percentage, setPercentage] = useState(0)

  const percentages = [0, 25, 50, 75, 100]

  const handlePercentageClick = (pct: number) => {
    setPercentage(pct)
    // Calculate amount based on percentage of available balance
    // This would be connected to actual wallet balance in production
  }

  return (
    <VStack align="stretch" spacing={4} w="full">
      {/* Collateral Input */}
      <VStack align="start" spacing={2} w="full">
        <Text color="font.secondary" fontSize="sm" fontWeight="medium">
          Collateral
        </Text>
        <InputGroup size="lg">
          <Input
            bg="background.level2"
            fontSize="xl"
            fontWeight="semibold"
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            pr="4.5rem"
            type="number"
            value={amount}
          />
          <InputRightAddon bg="transparent" border="none" pr={4}>
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="medium">
                USDC
              </Text>
              <Button
                color="font.secondary"
                minW="auto"
                onClick={() => setAmount('')}
                p={0}
                size="xs"
                variant="ghost"
              >
                ✕
              </Button>
            </HStack>
          </InputRightAddon>
        </InputGroup>
        <Text color="font.secondary" fontSize="xs">
          Balance: $0.00
        </Text>
      </VStack>

      {/* Percentage Buttons */}
      <HStack spacing={2}>
        {percentages.map(pct => (
          <Button
            bg={percentage === pct ? 'background.button.secondary' : 'transparent'}
            flex={1}
            key={pct}
            minW={0}
            onClick={() => handlePercentageClick(pct)}
            shadow={percentage === pct ? 'md' : 'none'}
            size="sm"
            variant={percentage === pct ? 'secondary' : 'ghost'}
          >
            {pct}%
          </Button>
        ))}
      </HStack>

      {/* Position Details */}
      <VStack align="stretch" pt={2} spacing={2}>
        <Flex justify="space-between">
          <Text color="font.secondary" fontSize="sm">
            Position Size
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            ${Number(amount).toFixed(2)}
          </Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="font.secondary" fontSize="sm">
            Entry Price
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            $108.77
          </Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="font.secondary" fontSize="sm">
            Liquidation Price
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            $0.00
          </Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="font.secondary" fontSize="sm">
            Trading Fee
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            0.05%
          </Text>
        </Flex>
      </VStack>

      {/* Action Button */}
      <Button colorScheme="green" mt={2} size="lg" w="full">
        Buy
      </Button>

      <Text color="font.secondary" fontSize="xs" textAlign="center">
        Connect wallet to start trading
      </Text>
    </VStack>
  )
}
