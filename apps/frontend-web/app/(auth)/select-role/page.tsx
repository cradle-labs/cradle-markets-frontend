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
  useToast,
} from '@chakra-ui/react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { setRole } from './actions'
import { useActionState, useEffect } from 'react'
/**
 * Select Role Page
 *
 * This page allows users to select their account type (institutional or retail).
 * When a role is selected:
 * 1. The role is set in Clerk's user metadata (server action)
 * 2. A trading account is created in the Cradle system using useCreateAccount hook (client-side)
 * 3. The user is redirected to the dashboard on success
 */

export default function SelectRolePage() {
  const { signOut } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [state, formAction, isPending] = useActionState(setRole, { error: '' })

  // Handle successful account creation
  useEffect(() => {
    if (state.success && !state.partialSuccess) {
      // Show success toast
      toast({
        title: 'Account created successfully',
        description: `Your ${state.role} account has been set up.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Use hard navigation to ensure session is fully refreshed
      // This prevents redirect loops caused by stale JWT tokens
      router.push('/trade')
    } else if (state.partialSuccess) {
      // Show warning toast for partial success
      toast({
        title: 'Account setup incomplete',
        description: state.error || 'Please contact support to complete your account setup.',
        status: 'warning',
        duration: 7000,
        isClosable: true,
      })
    }
  }, [state.success, state.partialSuccess, state.role, state.error, router, toast])

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
                  <input name="role" type="hidden" value="institutional" />
                  <Flex align="center" direction="column" gap={6} h="full">
                    <VStack align="center" spacing={3}>
                      <Heading color="font.primary" size="lg">
                        Institutional
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
                      isDisabled={isPending || state.success}
                      isLoading={isPending || state.success}
                      size="lg"
                      type="submit"
                      variant="primary"
                      w="full"
                    >
                      Select Institutional
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
                      isDisabled={isPending || state.success}
                      isLoading={isPending || state.success}
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
