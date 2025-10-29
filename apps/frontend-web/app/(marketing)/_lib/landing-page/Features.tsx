'use client'

import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Link,
  chakra,
  Stack,
  Center,
} from '@chakra-ui/react'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'

import { useState, useEffect, useRef } from 'react'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { HookIcon } from '@repo/lib/shared/components/icons/HookIcon'
import { PieIcon } from '@repo/lib/shared/components/icons/PieIcon'
import { StarsIconPlain } from '@repo/lib/shared/components/icons/StarsIconPlain'
import { FeatureCard } from './shared/FeatureCard'
import { RadialPattern } from './shared/RadialPattern'
import { useBreakpoints } from '@repo/lib/shared/hooks/useBreakpoints'
import { FadeIn } from '@repo/lib/shared/components/animations/FadeIn'
import { WordsPullUp } from '@repo/lib/shared/components/animations/WordsPullUp'
import { motion, useInView } from 'framer-motion'

const MotionBox = motion(Box)
const MotionGrid = motion(Grid)
const MotionGridItem = motion(GridItem)

const keyFeatures = [
  {
    title: 'Simple Trading Interface',
    subTitle: 'Custom Trading',
    description:
      'Design pools tailored to your vision with Cradles Vault-first architecture. Build smarter, faster, and with less complexity.',
    icon: <PieIcon size={40} />,
  },
  {
    title: 'Multi-Product Ecosystem',
    subTitle: 'Flexible Framework',
    description: 'Limitless asset customization and utility',
    icon: <HookIcon size={70} />,
  },
  {
    title: 'Real-World Collateral',
    subTitle: 'Enhanced Yield',
    description: 'Stable assets, amplified utility.',
    icon: <StarsIconPlain size={32} />,
  },
]

const features = [
  {
    title: 'Regulated Custody',
    shortDescription:
      'Cradle partners with CMA-licensed entities to ensure every tokenized security is backed 1:1 by real NSE stocks held in proper custody, providing peace of mind for institutional and retail investors.',
    imageSrc: '/images/graphics/stone-1.png',
  },
  {
    title: 'Instant Settlement',
    shortDescription:
      "Leverage Hedera Hashgraph's enterprise-grade infrastructure to settle trades in seconds instead of T+2 days, unlocking capital efficiency and reducing counterparty risk.",
    imageSrc: '/images/graphics/stone-2.png',
  },
  {
    title: 'Dual-Pricing Architecture',
    shortDescription:
      'Our unique system maintains NSE-pegged prices in Cradle Maker for predictability while enabling market-driven price discovery in Cradle Orderbook, creating natural arbitrage opportunities.',
    imageSrc: '/images/graphics/stone-1.png',
  },
  {
    title: 'Cross-Product Composability',
    shortDescription:
      'Use the same tokenized securities across trading, lending, and stablecoin backing without additional conversion steps, maximizing capital efficiency across the entire ecosystem.',
    imageSrc: '/images/graphics/stone-2.png',
  },
  {
    title: 'Transparent Reserves',
    shortDescription:
      'Real-time proof-of-reserves ensures every token is backed by actual securities, with independent audits and on-chain verification providing unprecedented transparency.',
    imageSrc: '/images/graphics/stone-1.png',
  },
  {
    title: 'Multi-Asset Trading Pairs',
    shortDescription:
      'Trade NSE securities against stablecoins, HBAR, and other digital assets, creating bridges between African capital markets and global crypto liquidity.',
    imageSrc: '/images/graphics/stone-2.png',
  },
]
function FeatureText({
  title,
  shortDescription,
  description,
  index,
}: {
  title: string
  shortDescription: string
  description?: string
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isOdd = index % 2 === 1

  return (
    <VStack
      alignItems="start"
      position="relative"
      spacing="sm"
      {...(isOdd && { bg: 'background.level0' })}
      p="md"
      rounded="lg"
    >
      <Heading as="h5" size="md">
        {title}
      </Heading>
      <Box position="relative">
        <Text color="font.secondary" sx={{ textWrap: 'balance' }} whiteSpace="pre-line">
          {shortDescription}
          {description && (
            <Link ml="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show less' : 'Read more'}
            </Link>
          )}
        </Text>
        {isExpanded && (
          <MotionBox
            animate={{ opacity: 1 }}
            bg="background.level0"
            borderRadius="md"
            boxShadow="lg"
            initial={{ opacity: 0 }}
            left={-4}
            maxW="600px"
            p={4}
            position="absolute"
            top={-4}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Text color="font.secondary" fontSize="lg" whiteSpace="pre-line">
              {description}
              <Link ml="sm" onClick={() => setIsExpanded(false)}>
                Show less
              </Link>
            </Text>
          </MotionBox>
        )}
      </Box>
    </VStack>
  )
}

export function Features() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useBreakpoints()

  const gridRef = useRef(null)
  const isInView = useInView(gridRef, { once: true, margin: '-50px' })

  const gridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const gridItemVariants = {
    show: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
    hidden: { opacity: 0, filter: 'blur(3px)', scale: 0.95, y: 15 },
  }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Add a buffer of 100px to delay the start of the animation
        const buffer = 300

        // Calculate progress with buffer
        const progress = Math.min(
          Math.max(((windowHeight - (rect.top + buffer)) / rect.height) * 100, 0),
          100
        )
        setScrollPercentage(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Noise position="relative">
      <DefaultPageContainer
        minH="800px"
        noVerticalPadding
        position="relative"
        pt={['xl', '3xl']}
        py={['3xl', '10rem']}
      >
        <FadeIn delay={0.2} direction="up" duration={0.6}>
          <Heading as="h4" mx="auto" size="lg">
            <chakra.span color="font.primary">Tokenized securities solutions.</chakra.span>
            <chakra.span color="font.primary" style={{ opacity: 0.6 }}>
              {' '}
              With Cradle, investors harness a platform that bridges traditional finance with
              blockchain, enabling them to focus exclusively on opportunity.
            </chakra.span>
          </Heading>
        </FadeIn>

        <MotionGrid
          animate={isInView ? 'show' : 'hidden'}
          gap="xl"
          initial="hidden"
          mt="2xl"
          ref={gridRef}
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
          variants={gridVariants}
        >
          {keyFeatures.map((feature, index) => (
            <MotionGridItem key={index} variants={gridItemVariants}>
              <FeatureCard {...feature} iconProps={{ color: 'font.primary' }} />
            </MotionGridItem>
          ))}
        </MotionGrid>

        <Stack direction={{ base: 'column', lg: 'row' }} gap="2xl" mt="3xl">
          <Box
            alignSelf="flex-start"
            h={isMobile ? 'auto' : '700px'}
            position="sticky"
            top="82px"
            w="full"
          >
            <VStack alignItems="start" spacing="lg">
              <WordsPullUp
                as="h2"
                color="font.primary"
                fontSize="4xl"
                fontWeight="bold"
                letterSpacing="-0.04rem"
                lineHeight={1}
                text="Technical highlights"
              />
              <FadeIn delay={0.2} direction="up" duration={0.6}>
                <Text color="font.secondary" fontSize="lg" sx={{ textWrap: 'pretty' }}>
                  Cradle introduces a series of features that streamline the tokenization and
                  utilization of NSE securities, while maintaining the compliance and transparency
                  that have made traditional markets trusted by millions.
                </Text>
              </FadeIn>
            </VStack>
            {!isMobile && (
              <Center position="relative">
                <RadialPattern
                  circleCount={8}
                  height={600}
                  innerHeight={150}
                  innerWidth={150}
                  position="absolute"
                  progress={scrollPercentage}
                  top={-10}
                  width={600}
                ></RadialPattern>
              </Center>
            )}
          </Box>
          <VStack ref={containerRef} spacing="md" w="full">
            {features.map((feature, index) => (
              <FadeIn direction="up" key={index} zIndex={10 - index}>
                <FeatureText index={index} {...feature} />
              </FadeIn>
            ))}
          </VStack>
        </Stack>
      </DefaultPageContainer>

      <Box
        bgGradient="linear(transparent 0%, background.base 50%, transparent 100%)"
        bottom="0"
        h="200px"
        left="0"
        mb="-100px"
        position="absolute"
        w="full"
      />
    </Noise>
  )
}
