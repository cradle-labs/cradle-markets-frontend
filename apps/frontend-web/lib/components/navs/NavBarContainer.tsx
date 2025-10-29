'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '@repo/lib/shared/components/navs/NavBar'
import { NavLogo } from './NavLogo'
import { MobileNav } from '@repo/lib/shared/components/navs/MobileNav'
import { useNav } from '@repo/lib/shared/components/navs/useNav'
import { CradleLogoType } from '../imgs/CradleLogoType'
import { PROJECT_CONFIG } from '@repo/lib/config/getProjectConfig'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { RoleBadge } from '../auth/RoleBadge'
import DarkModeToggle from '@repo/lib/shared/components/btns/DarkModeToggle'
import { useRole } from '@/lib/hooks/useRole'

export function NavBarContainer() {
  const { role } = useRole()
  const { allAppLinks: defaultNavLinks, getFilteredLinks } = useNav()

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
                <UserButton />
              </SignedIn>
            </HStack>
          }
        />
      </motion.div>
    </AnimatePresence>
  )
}
