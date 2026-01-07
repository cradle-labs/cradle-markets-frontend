'use client'

import { Card, Skeleton } from '@chakra-ui/react'
import { PaginatedTable } from '@repo/lib/shared/components/tables/PaginatedTable'
import { getPaginationProps } from '@repo/lib/shared/components/pagination/getPaginationProps'
import { LendingPoolTableHeader, PoolSortField } from './LendingPoolTableHeader'
import { LendingPoolTableRow } from './LendingPoolTableRow'
import { useCallback, useMemo, useState } from 'react'
import { useIsMounted } from '@repo/lib/shared/hooks/useIsMounted'
import type { LendingPool, Asset } from '@repo/lib/cradle-client-ts/types'

export interface LendingPoolData extends LendingPool {
  asset?: Asset
  totalSupplied?: number
  totalBorrowed?: number
  utilization?: number
  supplyAPY?: number
  borrowAPY?: number
  baseRate?: number
}

interface LendingPoolTableProps {
  pools: LendingPoolData[]
  loading: boolean
  onPoolClick?: (pool: LendingPoolData) => void
}

interface PaginationState {
  pageIndex: number
  pageSize: number
}

export function LendingPoolTable({ pools, loading, onPoolClick }: LendingPoolTableProps) {
  const isMounted = useIsMounted()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [sorting, setSorting] = useState<PoolSortField | undefined>(undefined)
  const [sortDesc, setSortDesc] = useState(true)

  // Sort pools based on selected field
  const sortedPools = useMemo(() => {
    if (!sorting) return pools

    const sorted = [...pools].sort((a, b) => {
      let aVal = 0
      let bVal = 0

      switch (sorting) {
        case 'total-supplied':
          aVal = a.totalSupplied ?? 0
          bVal = b.totalSupplied ?? 0
          break
        case 'total-borrowed':
          aVal = a.totalBorrowed ?? 0
          bVal = b.totalBorrowed ?? 0
          break
        case 'utilization':
          aVal = a.utilization ?? 0
          bVal = b.utilization ?? 0
          break
        case 'supply-apy':
          aVal = a.supplyAPY ?? 0
          bVal = b.supplyAPY ?? 0
          break
        case 'borrow-apy':
          aVal = a.baseRate ?? 0
          bVal = b.baseRate ?? 0
          break
      }

      return sortDesc ? bVal - aVal : aVal - bVal
    })

    return sorted
  }, [pools, sorting, sortDesc])

  const paginationProps = getPaginationProps(sortedPools.length, pagination, setPagination)
  const showPagination = !!sortedPools.length && sortedPools.length > pagination.pageSize

  const handleSort = (field: PoolSortField) => {
    if (sorting === field) {
      setSortDesc(!sortDesc)
    } else {
      setSorting(field)
      setSortDesc(true)
    }
  }

  const rowProps = useMemo(
    () => ({
      alignItems: 'center',
      gap: { base: 'xxs', xl: 'lg' },
      gridTemplateColumns: '32px minmax(200px, 1fr) 120px 120px 120px 120px 120px',
      px: { base: 'sm', sm: '0' },
    }),
    []
  )

  const renderTableHeader = useCallback(
    () => (
      <LendingPoolTableHeader
        onSort={handleSort}
        sortDesc={sortDesc}
        sorting={sorting}
        {...rowProps}
      />
    ),
    [sorting, sortDesc, rowProps]
  )

  const renderTableRow = useCallback(
    ({ item, index }: { item: LendingPoolData; index: number }) => (
      <LendingPoolTableRow index={index} onPoolClick={onPoolClick} pool={item} {...rowProps} />
    ),
    [onPoolClick, rowProps]
  )

  if (!isMounted) return <Skeleton h="500px" w="full" />

  return (
    <Card
      alignItems="flex-start"
      left={{ base: '-4px', sm: '0' }}
      overflowX={{ base: 'auto', '2xl': 'hidden' }}
      overflowY="hidden"
      p={{ base: '0', sm: '0' }}
      position="relative"
      pr={{ base: 'lg', sm: 'lg', md: 'lg', lg: '0' }}
      w={{ base: '100vw', lg: 'full' }}
    >
      <PaginatedTable
        getRowId={item => item.id}
        items={sortedPools}
        loading={loading}
        noItemsFoundLabel="No lending pools found"
        paginationProps={paginationProps}
        renderTableHeader={renderTableHeader}
        renderTableRow={renderTableRow}
        showPagination={showPagination}
      />
    </Card>
  )
}
