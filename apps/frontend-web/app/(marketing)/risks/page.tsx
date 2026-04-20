'use client'

import { Box, Container, Text, Button } from '@chakra-ui/react'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { useRouter } from 'next/navigation'

export default function Risks() {
  const router = useRouter()
  
  return (
    <Container maxW="container.md" py="20">
      <FadeInOnView>
        <Box textAlign="center">
          <Text fontSize="5xl" fontWeight="extrabold" my="6">
            {' '}
            🚧 Under Construction 🚧
          </Text>
          <Text color="gray.400" fontSize="xl" mb="8">
            This page is currently being built. Please check back soon!
          </Text>
          
          {/* ✅ Added back button */}
          <Button 
            colorScheme="gray" 
            variant="outline"
            onClick={() => router.back()}
            aria-label="Go back to previous page"
          >
            Go Back
          </Button>
        </Box>
      </FadeInOnView>
    </Container>
  )
}
