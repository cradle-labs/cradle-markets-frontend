'use client'

import { fadeIn } from '@repo/lib/shared/utils/animations'
import { CradleLogo } from '../imgs/CradleLogo'
import { CradleLogoType } from '../imgs/CradleLogoType'
import { Box, Link } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import NextLink from 'next/link'

export function NavLogo() {
  return (
    <Box as={motion.div} variants={fadeIn}>
      <Link as={NextLink} href="/" prefetch variant="nav">
        <Box  _dark={{ color: 'white' }} color="black">
          <Box display={{ base: 'block', md: 'none' }}>
            <CradleLogo width="26px" />
          </Box>
          <Box display={{ base: 'none', md: 'block' }}>
            <CradleLogoType width="106px" />
          </Box>
        </Box>
      </Link>
    </Box>
  )
}
