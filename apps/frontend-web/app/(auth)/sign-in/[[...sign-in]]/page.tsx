'use client'

import { Box, Center, Container, VStack, useToken } from '@chakra-ui/react'
import { SignIn } from '@clerk/nextjs'
import { useTheme } from 'next-themes'

export default function SignInPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Get theme colors from Chakra
  const [purple500, gray50, gray100, gray400, gray500, gray700, gray800, gradientDawn] = useToken(
    'colors',
    [
      'purple.500',
      'gray.50',
      'gray.100',
      'gray.400',
      'gray.500',
      'gray.700',
      'gray.800',
      'gradient.dawnDark',
    ]
  )

  return (
    <Container maxW="lg" py={16}>
      <Center>
        <VStack align="center" py={10} spacing={6}>
          <Box w="full">
            <SignIn
              appearance={{
                variables: isDark
                  ? {
                      // Dark theme colors from your theme
                      colorPrimary: purple500,
                      colorText: '#ffffff',
                      colorTextSecondary: gray400,
                      colorBackground: gray800,
                      colorInputBackground: gray700,
                      colorInputText: '#ffffff',
                    }
                  : {
                      // Light theme colors from your theme
                      colorPrimary: purple500,
                      colorText: gray700,
                      colorTextSecondary: gray500,
                      colorBackground: '#ffffff',
                      colorInputBackground: gray50,
                      colorInputText: gray700,
                    },
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-transparent shadow-none border-0 w-full',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: {
                    background: isDark ? gray700 : gray50,
                    color: isDark ? 'white' : gray700,
                    '&:hover': {
                      background: isDark ? gray800 : gray100,
                    },
                  },
                  formButtonPrimary: {
                    background: gradientDawn,
                    border: 'none',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.75rem',
                    '&:hover': {
                      opacity: '0.9',
                    },
                  },
                  formFieldInput:
                    'bg-background.level1 border border-border.base text-font.primary focus:border-purple.500',
                  formFieldLabel: 'text-font.secondary font-medium',
                  footerActionLink: 'text-purple.500 hover:text-purple.600',
                  identityPreviewEditButton: 'text-purple.500 hover:text-purple.600',
                  formResendCodeLink: 'text-purple.500 hover:text-purple.600',
                },
              }}
              fallbackRedirectUrl="/trade"
            />
          </Box>
        </VStack>
      </Center>
    </Container>
  )
}
