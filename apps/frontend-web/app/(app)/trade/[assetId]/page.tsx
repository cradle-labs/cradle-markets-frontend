import { AssetDetailPage } from '@repo/lib/modules/trade/AssetDetail/AssetDetailPage'

interface AssetDetailPageProps {
  params: {
    assetId: string
  }
}

export default async function AssetDetailPageWrapper({ params }: AssetDetailPageProps) {
  const { assetId } = await params
  return <AssetDetailPage assetId={assetId} />
}
