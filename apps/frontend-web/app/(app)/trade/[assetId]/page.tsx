import { AssetDetailPage } from '@repo/lib/modules/trade/AssetDetail/AssetDetailPage'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

interface AssetDetailPageProps {
  params: {
    assetId: string
  }
}

export default async function AssetDetailPageWrapper({ params }: AssetDetailPageProps) {
  const { assetId } = await params
  return (
    <RoleGuard allowedRoles={['institution']} fallbackPath="/access-denied">
      <AssetDetailPage assetId={assetId} />
    </RoleGuard>
  )
}
