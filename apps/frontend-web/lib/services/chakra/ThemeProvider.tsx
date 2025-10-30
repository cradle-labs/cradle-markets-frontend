'use client'

import { ChakraProvider, ThemeTypings } from '@chakra-ui/react'
import { ReactNode, useMemo } from 'react'
import { theme as balTheme } from './themes/bal/bal.theme'
import { useIsMounted } from '@repo/lib/shared/hooks/useIsMounted'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted()

  function getTheme(): ThemeTypings {
    return balTheme
  }

  const theme = useMemo(() => getTheme(), [])

  // Avoid hydration error in turbopack mode
  if (!isMounted) return null

  return (
    <ChakraProvider
      cssVarsRoot="body"
      theme={theme}
      toastOptions={{ defaultOptions: { position: 'bottom-right' } }}
    >
      {children}
    </ChakraProvider>
  )
}
