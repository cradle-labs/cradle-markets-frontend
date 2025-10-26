import { Box, HStack, Link, Text, VStack, Flex } from '@chakra-ui/react'
import { CradleIconCircular } from '@repo/lib/shared/components/icons/logos/CradleIconCircular'
import { BeetsIconCircular } from '@repo/lib/shared/components/icons/logos/BeetsIconCircular'
import { CowIconCircular } from '@repo/lib/shared/components/icons/logos/CowIconCircular'
import { ArrowUpRight } from 'react-feather'
import { Picture } from '@repo/lib/shared/components/other/Picture'

const linkGroups = {
  'Builder resources': [
  
    { label: 'Code & Contracts', href: 'https://github.com/cradle-protocol', isExternal: true },
    {
      label: 'Data & Analytics',
      href: 'https://docs.cradleprotocol.com/data-and-analytics/data-and-analytics/subgraph.html',
      isExternal: true,
    },
    {
      label: 'Partner onboarding',
      href: 'https://docs.cradleprotocol.com/partner-onboarding/onboarding-overview/introduction.html',
      isExternal: true,
    },

  ],
  'In the docs': [
    {
      label: 'Core concepts',
      href: 'https://docs.cradleprotocol.com/concepts/core-concepts/introduction.html',
      isExternal: true,
    },
  
    {
      label: 'Integration guides',
      href: 'https://docs.cradleprotocol.com/integration-guides/',
      isExternal: true,
    },
  ],
}

export function BuildPopover() {
  return (
    <Flex
      align="flex-start"
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: '5', sm: '20px', md: '40px' }}
    >
      <CreateAPool />
      {Object.entries(linkGroups).map(([title, links]) => (
        <VStack align="flex-start" key={title} minW={{ base: 'auto', md: '150px' }} spacing="sm">
          <Text fontWeight="bold">{title}</Text>
          <VStack align="flex-start" mt="xs">
            {links.map(link => (
              <Link
                _hover={{ textDecoration: 'none', color: 'font.highlight' }}
                alignItems="center"
                color="font.secondary"
                data-group
                display="flex"
                fontSize={{ base: 'sm', md: 'md' }}
                gap="xxs"
                href={link.href}
                isExternal={link.isExternal}
                key={link.label}
              >
                {link.label}{' '}
                {link.isExternal && (
                  <Box
                    _groupHover={{ opacity: 1 }}
                    opacity="0.5"
                    transition="all 0.2s var(--ease-out-cubic)"
                  >
                    <ArrowUpRight size={12} />
                  </Box>
                )}
              </Link>
            ))}
          </VStack>
        </VStack>
      ))}
    </Flex>
  )
}

function CreateAPool() {
  return (
    <Flex
      _hover={{ shadow: 'lg' }}
      borderRadius="md"
      flex="1"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      overflow="hidden"
      p={{ base: 'ms', sm: 'md' }}
      position="relative"
      shadow="2xl"
      w={{ base: 'auto', md: '180px' }}
    >
      <Box bottom="0" left="0" position="absolute" right="0" top="0">
        <Picture
          altText="Background texture"
          defaultImgType="png"
          directory="/images/textures/"
          height="100%"
          imgAvif
          imgAvifDark
          imgAvifPortrait
          imgAvifPortraitDark
          imgName="rock-slate"
          imgPng
          imgPngDark
          width="100%"
        />
      </Box>
      <Flex
        alignItems="center"
        direction="row"
        gap={{ base: 'ms', sm: 'md', lg: 'lg' }}
        position="relative"
        zIndex={2}
      >
        <VStack align="flex-start" spacing="sm">
          <Link
            _hover={{ color: 'font.highlight' }}
            alignItems="center"
            color="font.maxContrast"
            data-group
            display="flex"
            gap="xxs"
            href="https://pool-creator.cradleprotocol.com/"
            isExternal
            variant="nav"
          >
            <Text
              _groupHover={{ color: 'font.highlight' }}
              color="font.maxContrast"
              fontWeight="bold"
              transition="color 0.2s var(--ease-out-cubic)"
            >
              Create a pool
            </Text>
            <Box
              _groupHover={{ opacity: 1 }}
              opacity="0.5"
              transition="all 0.2s var(--ease-out-cubic)"
            >
              <ArrowUpRight size={12} />
            </Box>
          </Link>
          <VStack align="flex-start" pt="xs" w="full">
            <PoolLink
              href="https://pool-creator.cradleprotocol.com/v3"
              icon={<CradleIconCircular size={32} />}
              isExternal
              label="Cradle"
            />
            <PoolLink
              href="https://pool-creator.cradleprotocol.com/cow"
              icon={<CowIconCircular size={32} />}
              isExternal
              label="CoW AMM"
            />
            <PoolLink
              href="https://pool-creator.cradleprotocol.com/beets"
              icon={<BeetsIconCircular size={32} />}
              isExternal
              label="Beets"
            />
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  )
}

type PoolLinkProps = { href: string; icon: React.ReactNode; isExternal?: boolean; label: string }

function PoolLink({ href, icon, isExternal, label }: PoolLinkProps) {
  return (
    <Link
      _hover={{ color: 'font.highlight', textDecoration: 'none' }}
      color="font.maxContrast"
      href={href}
      isExternal={isExternal}
      py="xxs"
      role="group"
      rounded="md"
      w="full"
    >
      <HStack
        _groupHover={{ color: 'font.highlight' }}
        color="white"
        transition="color 0.2s var(--ease-out-cubic)"
      >
        {icon}
        <Text
          _groupHover={{ color: 'font.highlight' }}
          alignItems="center"
          color="font.maxContrast"
          display="flex"
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="bold"
          gap="xxs"
        >
          {label}
          <Box _groupHover={{ opacity: 1 }} as="span" opacity="0.5">
            <ArrowUpRight size={12} />
          </Box>
        </Text>
      </HStack>
    </Link>
  )
}
