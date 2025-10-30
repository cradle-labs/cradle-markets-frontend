'use client'

import { Grid, GridItem, GridProps, Text } from '@chakra-ui/react'
import { SortableHeader, Sorting } from '@repo/lib/shared/components/tables/SortableHeader'

export type PoolSortField =
  | 'total-supplied'
  | 'total-borrowed'
  | 'utilization'
  | 'supply-apy'
  | 'borrow-apy'

interface LendingPoolTableHeaderProps extends GridProps {
  sorting?: PoolSortField
  onSort: (field: PoolSortField) => void
  sortDesc: boolean
}

export function LendingPoolTableHeader({
  sorting,
  onSort,
  sortDesc,
  ...rest
}: LendingPoolTableHeaderProps) {
  return (
    <Grid p={['sm', 'md']} w="full" {...rest}>
      <GridItem>
        <Text fontWeight="bold">#</Text>
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">Pool Name</Text>
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'total-supplied'}
          label="Total Supplied"
          onSort={() => onSort('total-supplied')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'total-borrowed'}
          label="Total Borrowed"
          onSort={() => onSort('total-borrowed')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'utilization'}
          label="Utilization"
          onSort={() => onSort('utilization')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'supply-apy'}
          label="Supply APY"
          onSort={() => onSort('supply-apy')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
      <GridItem justifySelf="end">
        <SortableHeader
          align="right"
          isSorted={sorting === 'borrow-apy'}
          label="Borrow APY"
          onSort={() => onSort('borrow-apy')}
          sorting={sortDesc ? Sorting.desc : Sorting.asc}
        />
      </GridItem>
    </Grid>
  )
}
