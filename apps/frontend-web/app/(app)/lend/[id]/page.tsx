'use client'

import { useParams } from 'next/navigation'
import { LendPoolDetailsPage } from '@repo/lib/shared/pages'

export default function LendPoolDetailsPageWrapper() {
  const params = useParams()
  const poolId = params?.id as string

  return <LendPoolDetailsPage poolId={poolId} />
}
