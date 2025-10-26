'use client'

import { Grid, Skeleton } from '@chakra-ui/react'
import { TokenizedAssetCard, TokenizedAssetData } from './TokenizedAssetCard'

interface TokenizedAssetGridProps {
  assets: TokenizedAssetData[]
  loading?: boolean
  onAssetClick?: (asset: TokenizedAssetData) => void
}

export function TokenizedAssetGrid({ assets, loading = false, onAssetClick }: TokenizedAssetGridProps) {
  if (loading) {
    return (
      <Grid
        gap={4}
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton borderRadius="xl" h={200} key={index} />
        ))}
      </Grid>
    )
  }

  return (
    <Grid
      gap={4}
      templateColumns={{
        base: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)',
      }}
    >
      {assets.map((asset) => (
        <TokenizedAssetCard
          asset={asset}
          key={asset.id}
          onClick={onAssetClick ? () => onAssetClick(asset) : undefined}
        />
      ))}
    </Grid>
  )
}

