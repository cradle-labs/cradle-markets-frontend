'use client'

import { LandingV3Layout } from './_lib/landing-page/LandingV3Layout'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Center, Spinner, VStack, Text } from '@chakra-ui/react'

export default function Home() {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoaded) return // Wait for auth to load

    if (userId && user) {
      setIsRedirecting(true)
      // User is authenticated, check if they have a role
      const userRole = user.publicMetadata?.role as string | undefined

      if (userRole) {
        // User has a role, redirect to trade page
        router.push('/trade')
      } else {
        // User doesn't have a role, redirect to select-role
        router.push('/select-role')
      }
    }
  }, [isLoaded, userId, user, router])

  // Show loading state while auth is loading or redirecting
  if (!isLoaded || isRedirecting) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner color="purple.500" size="lg" />
          <Text color="font.secondary">Loading...</Text>
        </VStack>
      </Center>
    )
  }

  // User is not authenticated, show landing page
  return <LandingV3Layout />
}
