'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '@repo/lib/shared/components/navs/NavBar'
import { NavLogo } from './NavLogo'
import { MobileNav } from '@repo/lib/shared/components/navs/MobileNav'
import { useNav } from '@repo/lib/shared/components/navs/useNav'
import { CradleLogoType } from '../imgs/CradleLogoType'
import { BuildNavLink } from './BuildNavLink'
import { PROJECT_CONFIG, isCradle } from '@repo/lib/config/getProjectConfig'

export function NavBarContainer() {
  const { defaultAppLinks } = useNav()

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
          customLinks={isCradle ? <BuildNavLink key="build-nav-link" /> : undefined}
          mobileNav={
            <MobileNav
              appLinks={allAppLinks}
              ecosystemLinks={ecosystemLinks}
              LogoType={CradleLogoType}
              socialLinks={socialLinks}
            />
          }
          navLogo={<NavLogo />}
        />
      </motion.div>
    </AnimatePresence>
  )
}
