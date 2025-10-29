'use client'

import { Box, Center, Container, VStack } from '@chakra-ui/react'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <Container maxW="lg" py={16}>
      <Center>
        <VStack align="center" py={10} spacing={6}>
          <Box w="full">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-transparent shadow-none border-0 w-full',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton:
                    'bg-background.level1 border border-border.base hover:bg-background.level3 text-font.primary',
                  formButtonPrimary:
                    'bg-purple.500 hover:bg-purple.600 text-white font-medium py-3',
                  formFieldInput:
                    'bg-background.level1 border border-border.base text-font.primary focus:border-purple.500',
                  formFieldLabel: 'text-font.secondary font-medium',
                  footerActionLink: 'text-purple.500 hover:text-purple.600',
                  identityPreviewEditButton: 'text-purple.500 hover:text-purple.600',
                  formResendCodeLink: 'text-purple.500 hover:text-purple.600',
                },
              }}
            />
          </Box>
        </VStack>
      </Center>
    </Container>
  )
}
