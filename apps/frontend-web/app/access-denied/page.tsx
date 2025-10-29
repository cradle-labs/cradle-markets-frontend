import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { Shield } from 'react-feather'

export default function AccessDeniedPage() {
  return (
    <Container maxW="md" py={16}>
      <VStack align="center" spacing={8} textAlign="center">
        <Box _dark={{ bg: 'red.900' }} bg="red.50" borderRadius="full" p={6}>
          <Shield color="currentColor" size={48} />
        </Box>

        <VStack spacing={4}>
          <Heading color="font.primary" size="xl">
            Access Denied
          </Heading>
          <Text color="font.secondary" fontSize="lg">
            You don't have the required permissions to access this page.
          </Text>
          <Text color="font.secondary">
            Please contact your administrator if you believe this is an error.
          </Text>
        </VStack>

        <VStack spacing={4}>
          <Link href="/" passHref>
            <Button colorScheme="purple" size="lg">
              Return to Home
            </Button>
          </Link>
          <Link href="/portfolio" passHref>
            <Button size="lg" variant="outline">
              Go to Portfolio
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Container>
  )
}
