'use client'

import { Box, Heading, Stack, Text, VStack } from '@chakra-ui/react'

export default function Portfolio() {
  return (
    <Stack gap={20} width="full">
      <VStack align="start" spacing={6} width="full">
        <Heading size="xl">Portfolio</Heading>
        <Text color="font.secondary">
          Your portfolio page is currently under development.
        </Text>
        
        <Box
          bg="background.level1"
          borderRadius="lg"
          p={8}
          w="full"
        >
          <VStack align="start" spacing={4}>
            <Heading size="md">Coming Soon</Heading>
            <Text color="font.secondary">
              Portfolio features including balance tracking, claims, and analytics will be available soon.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Stack>
  )
}
