'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '@repo/lib/shared/components/navs/NavBar'
import { NavLogo } from './NavLogo'
import { MobileNav } from '@repo/lib/shared/components/navs/MobileNav'
import { useNav } from '@repo/lib/shared/components/navs/useNav'
import { CradleLogoType } from '../imgs/CradleLogoType'
import { PROJECT_CONFIG } from '@repo/lib/config/getProjectConfig'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button, HStack, useToken } from '@chakra-ui/react'
import Link from 'next/link'
import { RoleBadge } from '../auth/RoleBadge'
import DarkModeToggle from '@repo/lib/shared/components/btns/DarkModeToggle'
import { useRole } from '@/lib/hooks/useRole'
import { useTheme } from 'next-themes'

export function NavBarContainer() {
  const { role } = useRole()
  const { allAppLinks: defaultNavLinks, getFilteredLinks } = useNav()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Get theme colors from Chakra
  const [purple500, gray50, gray400, gray500, gray700, gray800] = useToken('colors', [
    'purple.500',
    'gray.50',
    'gray.400',
    'gray.500',
    'gray.700',
    'gray.800',
  ])

  const defaultAppLinks = role ? getFilteredLinks(role) : defaultNavLinks

  const {
    links: { appLinks, ecosystemLinks, socialLinks },
    options,
  } = PROJECT_CONFIG

  const allowCreateWallet = options?.allowCreateWallet ?? false

  const allAppLinks = [...defaultAppLinks, ...appLinks]

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <NavBar
          allowCreateWallet={allowCreateWallet}
          appLinks={allAppLinks}
          mobileNav={
            <MobileNav
              appLinks={allAppLinks}
              ecosystemLinks={ecosystemLinks}
              LogoType={CradleLogoType}
              socialLinks={socialLinks}
            />
          }
          navLogo={<NavLogo />}
          rightSlot={
            <HStack spacing={4}>
              <DarkModeToggle />
              <SignedOut>
                <Link href="/sign-in" passHref>
                  <Button colorScheme="purple" size="sm" variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" passHref>
                  <Button colorScheme="purple" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <RoleBadge />
                <UserButton
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
                      userButtonPopoverCard: {
                        background: isDark ? gray800 : '#ffffff',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                        border: isDark ? `1px solid ${gray700}` : '1px solid #E5E7EB',
                      },
                      userButtonPopoverActionButton: {
                        color: isDark ? '#ffffff' : gray700,
                        '&:hover': {
                          background: isDark ? gray700 : gray50,
                        },
                      },
                      userButtonPopoverActionButtonText: {
                        color: isDark ? '#ffffff' : gray700,
                      },
                      userButtonPopoverActionButtonIcon: {
                        color: isDark ? gray400 : gray500,
                      },
                      userButtonPopoverFooter: {
                        background: isDark ? gray800 : '#ffffff',
                        borderTop: isDark ? `1px solid ${gray700}` : '1px solid #E5E7EB',
                      },
                      userPreviewMainIdentifier: {
                        color: isDark ? '#ffffff' : gray700,
                      },
                      userPreviewSecondaryIdentifier: {
                        color: isDark ? gray400 : gray500,
                      },
                    },
                  }}
                />
              </SignedIn>
            </HStack>
          }
        />
      </motion.div>
    </AnimatePresence>
  )
}
