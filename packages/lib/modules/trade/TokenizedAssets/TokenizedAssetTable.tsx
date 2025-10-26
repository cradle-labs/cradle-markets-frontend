'use client'

import { Card, Skeleton } from '@chakra-ui/react'
import { PaginatedTable } from '@repo/lib/shared/components/tables/PaginatedTable'
import { getPaginationProps } from '@repo/lib/shared/components/pagination/getPaginationProps'
import { TokenizedAssetData } from './TokenizedAssetCard'
import { TokenizedAssetTableHeader, AssetSortField } from './TokenizedAssetTableHeader'
import { TokenizedAssetTableRow } from './TokenizedAssetTableRow'
import { useCallback, useMemo, useState } from 'react'
import { useIsMounted } from '@repo/lib/shared/hooks/useIsMounted'

interface TokenizedAssetTableProps {
  assets: TokenizedAssetData[]
  loading: boolean
  onAssetClick?: (asset: TokenizedAssetData) => void
}

interface PaginationState {
  pageIndex: number
  pageSize: number
}

export function TokenizedAssetTable({ assets, loading, onAssetClick }: TokenizedAssetTableProps) {
  const isMounted = useIsMounted()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [sorting, setSorting] = useState<AssetSortField | undefined>(undefined)
  const [sortDesc, setSortDesc] = useState(true)

  const paginationProps = getPaginationProps(assets.length, pagination, setPagination)
  const showPagination = !!assets.length && assets.length > pagination.pageSize

  const handleSort = (field: AssetSortField) => {
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
      gridTemplateColumns: '32px minmax(200px, 1fr) 120px 120px 120px 140px 120px',
      px: { base: 'sm', sm: '0' },
    }),
    []
  )

  const renderTableHeader = useCallback(
    () => <TokenizedAssetTableHeader onSort={handleSort} sortDesc={sortDesc} sorting={sorting} {...rowProps} />,
    [sorting, sortDesc, rowProps]
  )

  const renderTableRow = useCallback(
    ({ item, index }: { item: TokenizedAssetData; index: number }) => (
      <TokenizedAssetTableRow
        asset={item}
        index={index}
        onAssetClick={onAssetClick}
        {...rowProps}
      />
    ),
    [onAssetClick, rowProps]
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
        items={assets}
        loading={loading}
        noItemsFoundLabel="No assets found"
        paginationProps={paginationProps}
        renderTableHeader={renderTableHeader}
        renderTableRow={renderTableRow}
        showPagination={showPagination}
      />
    </Card>
  )
}


