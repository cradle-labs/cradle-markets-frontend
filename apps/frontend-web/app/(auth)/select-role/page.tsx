'use client'

import {
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { setRole } from './actions'
import { useActionState, useEffect, useRef } from 'react'

export default function SelectRolePage() {
  const { signOut, getToken } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(setRole, { error: '' })
  const redirectAttempted = useRef(false)

  useEffect(() => {
    console.log('State changed:', state)
    if (state.success && state.role && !redirectAttempted.current) {
      redirectAttempted.current = true
      console.log('Role set successfully, waiting for session to update...')

      // Poll for the role to appear in the user object
      let attempts = 0
      const maxAttempts = 20 // 10 seconds max

      const checkRole = async () => {
        attempts++
        console.log(`Checking for role update... (attempt ${attempts}/${maxAttempts})`)

        // Force token refresh to get latest session
        await getToken({ skipCache: true })

        // Reload user data
        await user?.reload()

        // Check if role is now in publicMetadata
        const currentRole = user?.publicMetadata?.role
        console.log('Current role in metadata:', currentRole)

        if (currentRole === state.role) {
          console.log('Role confirmed in session, redirecting...')
          window.location.href = '/trade'
        } else if (attempts >= maxAttempts) {
          console.log('Max attempts reached, redirecting anyway...')
          window.location.href = '/trade'
        } else {
          // Try again in 500ms
          setTimeout(checkRole, 500)
        }
      }

      // Start checking after a brief initial delay
      setTimeout(checkRole, 1000)
    }
  }, [state, getToken, user])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <Container maxW="4xl" py={16}>
      <Center>
        <VStack align="center" spacing={8} w="full">
          <VStack align="center" spacing={4}>
            <Heading color="font.primary" size="xl" textAlign="center">
              Choose Your Account Type
            </Heading>
            <Text color="font.secondary" fontSize="lg" maxW="2xl" textAlign="center">
              Select the account type that best describes your trading needs. This will determine
              which features and markets you have access to.
            </Text>
          </VStack>

          {state.error && (
            <Text color="red.500" textAlign="center">
              {state.error}
            </Text>
          )}

          <HStack align="stretch" maxW="3xl" spacing={6} w="full">
            <Card
              _active={{ borderColor: 'purple.500' }}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              border="2px solid"
              borderColor="transparent"
              cursor="pointer"
              flex={1}
              transition="all 0.2s"
            >
              <CardBody display="flex" flexDirection="column" h="full" p={8}>
                <form
                  action={formAction}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <input name="role" type="hidden" value="institution" />
                  <Flex align="center" direction="column" gap={6} h="full">
                    <VStack align="center" spacing={3}>
                      <Heading color="font.primary" size="lg">
                        Institution
                      </Heading>
                      <Text color="font.secondary" textAlign="center">
                        For institutional traders, funds, and professional organizations
                      </Text>
                    </VStack>

                    <VStack align="start" flex={1} spacing={2} w="full">
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Advanced portfolio management
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Bulk trading operations
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Institutional analytics
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Dedicated account management
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Access to all markets (Cash, Lend, Perps, Portfolio, Trade)
                      </Text>
                    </VStack>

                    <Button
                      isLoading={isPending}
                      size="lg"
                      type="submit"
                      variant="primary"
                      w="full"
                    >
                      Select Institution
                    </Button>
                  </Flex>
                </form>
              </CardBody>
            </Card>

            <Card
              _active={{ borderColor: 'purple.500' }}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              border="2px solid"
              borderColor="transparent"
              cursor="pointer"
              flex={1}
              transition="all 0.2s"
            >
              <CardBody display="flex" flexDirection="column" h="full" p={8}>
                <form
                  action={formAction}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <input name="role" type="hidden" value="retail" />
                  <Flex align="center" direction="column" gap={6} h="full">
                    <VStack align="center" spacing={3}>
                      <Heading color="font.primary" size="lg">
                        Retail
                      </Heading>
                      <Text color="font.secondary" textAlign="center">
                        For individual traders and personal investment accounts
                      </Text>
                    </VStack>

                    <VStack align="start" flex={1} spacing={2} w="full">
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Personal portfolio tracking
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Individual trade execution
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Educational resources
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Real-time market data
                      </Text>
                      <Text color="font.secondary" fontSize="sm">
                        ✓ Access to retail features
                      </Text>
                    </VStack>

                    <Button
                      isLoading={isPending}
                      size="lg"
                      type="submit"
                      variant="primary"
                      w="full"
                    >
                      Select Retail
                    </Button>
                  </Flex>
                </form>
              </CardBody>
            </Card>
          </HStack>

          <VStack spacing={2}>
            <Text color="font.secondary" fontSize="sm" textAlign="center">
              Need to change your selection later? Contact support.
            </Text>
            <Button color="purple.500" onClick={handleSignOut} size="sm" variant="link">
              Sign out and choose a different account
            </Button>
          </VStack>
        </VStack>
      </Center>
    </Container>
  )
}
