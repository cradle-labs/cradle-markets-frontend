'use client'

import { Box, Container, Heading, Text } from '@chakra-ui/react'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'

export default function Components() {
  return (
    <Container maxW="container.md" py="20">
      <FadeInOnView>
        <Box textAlign="center">
          <Heading mb="6" size="2xl">
            🚧 Under Construction 🚧
          </Heading>
          <Text color="gray.600" fontSize="xl">
            This page is currently being built. Please check back soon!
          </Text>
        </Box>
      </FadeInOnView>
    </Container>
  )
}
