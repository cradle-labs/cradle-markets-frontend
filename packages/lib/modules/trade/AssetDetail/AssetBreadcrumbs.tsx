'use client'

import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button } from '@chakra-ui/react'
import { useAssetDetail } from './AssetDetailProvider'
import { ChevronRight, Home } from 'react-feather'

export function AssetBreadcrumbs() {
  const { asset } = useAssetDetail()

  if (!asset) return null

  return (
    <Breadcrumb
      color="grayText"
      fontSize="sm"
      pb="ms"
      separator={
        <Box color="border.base">
          <ChevronRight size={16} />
        </Box>
      }
      spacing="sm"
    >
      <BreadcrumbItem>
        <BreadcrumbLink href="/">
          <Button color="grayText" size="xs" variant="link">
            <Home size={16} />
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink fontWeight="medium" href="/trade">
          Trade
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">
          {asset.name} ({asset.symbol})
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
