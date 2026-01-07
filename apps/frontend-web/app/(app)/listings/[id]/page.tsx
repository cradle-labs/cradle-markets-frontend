'use client'

import { useParams } from 'next/navigation'
import { ListingDetailsPage } from '@repo/lib/shared/pages'

export default function ListingDetailsPageWrapper() {
  const params = useParams()
  const listingId = params?.id as string

  return <ListingDetailsPage listingId={listingId} />
}
