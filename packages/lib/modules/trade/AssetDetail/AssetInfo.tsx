'use client'

import { Box, Card, Text, VStack } from '@chakra-ui/react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'

interface AssetInfoProps {
  asset: TokenizedAssetData
}

// Mock company information - in a real app this would come from an API
const getAssetInfo = (asset: TokenizedAssetData) => {
  switch (asset.id) {
    case 'nvda':
      return {
        title: 'About¹',
        description: `NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company's Graphics segment offers GeForce GPUs for gaming and PCs, the GeForce NOW game streaming service and related infrastructure, and solutions for gaming platforms; Quadro/NVIDIA RTX GPUs for enterprise workstation graphics; vGPU software for cloud-based visual and virtual computing; automotive platforms for infotainment systems; and Omniverse software for building 3D designs and virtual worlds.

The company's Compute & Networking segment provides Data Center accelerated computing platforms for AI, HPC, and accelerated workloads; Mellanox networking and interconnect solutions; automotive AI Cockpit, autonomous driving development agreements, and autonomous vehicle solutions; and Jetson for robotics and other embedded platforms. NVIDIA Corporation was founded in 1993 and is headquartered in Santa Clara, California.`,
        marketCap: '$2.1T',
        volume24h: '$45.2B',
        circulatingSupply: '2.47B',
        allTimeHigh: '$974.00',
        allTimeLow: '$0.25',
      }
    case 'slv':
      return {
        title: 'About¹',
        description: `iShares Silver Trust (SLV) is an exchange-traded fund (ETF) that seeks to reflect generally the performance of the price of silver bullion. The Trust holds silver bullion and is intended to constitute a simple and cost-effective means of making an investment similar to an investment in silver. The shares of the Trust represent units of fractional undivided beneficial interest in and ownership of the Trust.

The Trust's investment objective is for the shares of the Trust to reflect the performance of the price of silver bullion, less the Trust's expenses. The Trust does not engage in any activities designed to obtain a profit from, or to ameliorate losses caused by, changes in the price of silver.`,
        marketCap: '$12.8B',
        volume24h: '$1.2B',
        circulatingSupply: '289.5M',
        allTimeHigh: '$48.35',
        allTimeLow: '$8.45',
      }
    default:
      return {
        title: 'About¹',
        description: `This is a tokenized representation of ${asset.name} (${asset.symbol}), providing exposure to the underlying asset through blockchain technology. Tokenized assets allow for fractional ownership, increased liquidity, and 24/7 trading of traditional financial instruments.

The token is backed by the underlying asset and maintains a 1:1 ratio with the original security, enabling investors to gain exposure to traditional markets through decentralized finance infrastructure.`,
        marketCap: 'N/A',
        volume24h: 'N/A',
        circulatingSupply: 'N/A',
        allTimeHigh: 'N/A',
        allTimeLow: 'N/A',
      }
  }
}

export function AssetInfo({ asset }: AssetInfoProps) {
  const info = getAssetInfo(asset)

  return (
    <Card>
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Text fontSize="lg" fontWeight="semibold">
            {info.title}
          </Text>
          
          <Text 
            color="font.secondary" 
            fontSize="sm" 
            lineHeight="1.6"
            whiteSpace="pre-line"
          >
            {info.description}
          </Text>

          {/* Key Statistics */}
          <VStack align="start" pt={4} spacing={3} w="full">
            <Text fontSize="md" fontWeight="semibold">
              Key Statistics
            </Text>
            
            <Box 
              display="grid" 
              gap={4} 
              gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" 
              w="full"
            >
              <VStack align="start" spacing={1}>
                <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                  Market Cap
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {info.marketCap}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                  24h Volume
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {info.volume24h}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                  Circulating Supply
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {info.circulatingSupply}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                  All Time High
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {info.allTimeHigh}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text color="font.secondary" fontSize="xs" textTransform="uppercase">
                  All Time Low
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {info.allTimeLow}
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* Legal Disclaimer */}
          <Box 
            bg="background.level1" 
            borderRadius="md" 
            mt={4}
            p={4} 
            w="full"
          >
            <Text color="font.secondary" fontSize="xs" lineHeight="1.5">
              <Text as="span" fontWeight="semibold">
                Legal Disclaimer:
              </Text>{' '}
              Global Markets tokens are not registered under the U.S. Securities Act of 1933, as amended (the 
              &quot;Securities Act&quot;), and may not be offered, sold or delivered within the United States or to, 
              or for the account or benefit of, U.S. persons, except pursuant to an exemption from, or in a transaction 
              not subject to, the registration requirements of the Securities Act.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Card>
  )
}
