import { AssetDetailPage } from '@repo/lib/modules/trade/AssetDetail/AssetDetailPage'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

interface MarketDetailPageProps {
  params: {
    marketId: string
  }
}

export default async function MarketDetailPageWrapper({ params }: MarketDetailPageProps) {
  const { marketId } = await params
  return (
    <RoleGuard allowedRoles={['institution', 'retail']} fallbackPath="/access-denied">
      <AssetDetailPage marketId={marketId} />
    </RoleGuard>
  )
}
