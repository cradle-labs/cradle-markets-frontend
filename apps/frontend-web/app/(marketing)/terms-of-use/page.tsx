'use client'

import { Box, Container, Text } from '@chakra-ui/react'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'

export default function Terms() {
  return (
    <Container maxW="container.md" py="20">
      <FadeInOnView>
        <Box textAlign="center">
          <Text fontSize="5xl" fontWeight="extrabold" my="6">
            {' '}
            🚧 Under Construction 🚧
          </Text>
          <Text color="gray.400" fontSize="xl">
            This page is currently being built. Please check back soon!
          </Text>
        </Box>
      </FadeInOnView>
    </Container>
  )
}
