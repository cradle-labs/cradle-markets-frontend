'use client'

import { Box, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react'
import { DefaultPageContainer } from '@repo/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@repo/lib/shared/components/containers/FadeInOnView'
import { PropsWithChildren } from 'react'
import Noise from '@repo/lib/shared/components/layout/Noise'
import { RadialPattern } from '@repo/lib/shared/components/zen/RadialPattern'
import { TradingChartExample } from '@repo/lib/modules/perps/trading-chart'
// import Orderbook from '@repo/lib/modules/perps/orderbook/Orderbook'
import { PerpsTradingPanel } from '@repo/lib/modules/perps/trading-panel'

type PerpsPageProps = PropsWithChildren

export function PerpsPage({ children }: PerpsPageProps) {
  return (
    <>
      <Box borderBottom="1px solid" borderColor="border.base">
        <Noise
          backgroundColor="background.level0WithOpacity"
          overflow="hidden"
          position="relative"
          shadow="innerBase"
        >
          <DefaultPageContainer
            pb={['xl', 'xl', '10']}
            pr={{ base: '0 !important', md: 'md !important' }}
            pt={['xl', '40px']}
          >
            <Box display={{ base: 'none', md: 'block' }}>
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                padding="15px"
                position="absolute"
                right={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                top="40px"
                width={1000}
              />
              <RadialPattern
                circleCount={8}
                height={600}
                innerHeight={150}
                innerWidth={500}
                left={{ base: -800, lg: -700, xl: -600, '2xl': -400 }}
                padding="15px"
                position="absolute"
                top="40px"
                width={1000}
              />
            </Box>
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="-300px"
              width={600}
            />
            <RadialPattern
              circleCount={8}
              height={600}
              innerHeight={150}
              innerWidth={150}
              left="calc(50% - 300px)"
              position="absolute"
              top="300px"
              width={600}
            />
            <FadeInOnView animateOnce={false}>
              <VStack
                align={{ base: 'start', md: 'start' }}
                gap="4"
                justify={{ base: 'start', md: 'space-between' }}
                mb="10"
              >
                <Box>
                  <Heading pb="3" sx={{ textWrap: 'balance' }} variant="special">
                    Perpetual Trading
                  </Heading>
                  <Text sx={{ textWrap: 'balance' }} variant="secondary">
                    Trade with leverage on the most tokenised assets
                  </Text>
                </Box>
              </VStack>
            </FadeInOnView>
            <FadeInOnView animateOnce={false}>
              <Box pb={{ base: '0', md: '3' }}>{children}</Box>
            </FadeInOnView>
          </DefaultPageContainer>
        </Noise>
      </Box>

      <Box bg="background.level0" py={{ base: 4, lg: 6 }}>
        <FadeInOnView animateOnce={false}>
          <Grid
            maxW="1920px"
            mx="auto"
            px={{ base: 4, lg: 6 }}
            templateColumns={{ base: '1fr', lg: 'repeat(12, 1fr)' }}
          >
            {/* Trading Chart - Left Column */}
            <GridItem colSpan={{ base: 12, lg: 7 }}>
              <Box
                bg="background.level1"
                h="full"
                minH={{ base: 'auto', lg: '600px' }}
                overflow="hidden"
                shadow="innerBase"
              >
                <TradingChartExample />
              </Box>
            </GridItem>

            {/* Order Book - Center Column */}
            <GridItem colSpan={{ base: 12, lg: 2 }}>
              <Box>{/* <Orderbook /> */}</Box>
            </GridItem>

            {/* Trading Form - Right Column */}
            <GridItem colSpan={{ base: 12, lg: 3 }}>
              <PerpsTradingPanel />
            </GridItem>
          </Grid>
        </FadeInOnView>
      </Box>
    </>
  )
}
