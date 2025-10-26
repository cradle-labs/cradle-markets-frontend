'use client'

import { Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import { SortableHeader, Sorting } from '@repo/lib/shared/components/tables/SortableHeader'

export type AssetSortField = 'price' | 'change' | 'change-percent' | 'volume'

interface TokenizedAssetTableHeaderProps extends GridProps {
  sorting?: AssetSortField
  onSort: (field: AssetSortField) => void
  sortDesc: boolean
}

export function TokenizedAssetTableHeader({
  sorting,
  onSort,
  sortDesc,
  ...rest
}: TokenizedAssetTableHeaderProps) {
  return (
    <Grid p={['sm', 'md']} w="full" {...rest}>
      <GridItem>
        <Text fontWeight="bold">#</Text>
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">Asset Name</Text>
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'price'}
          label="Price"
          onSort={() => onSort('price')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'change'}
          label="24h ($)"
          onSort={() => onSort('change')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'change-percent'}
          label="24H (%)"
          onSort={() => onSort('change-percent')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'volume'}
          label="24H Volume"
          onSort={() => onSort('volume')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="center">
        <Text fontWeight="bold">24h Chart</Text>
      </GridItem>
    </Grid>
  )
}

