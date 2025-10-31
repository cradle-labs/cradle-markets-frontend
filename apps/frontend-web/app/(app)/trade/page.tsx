import { TokenizedAssetsPage } from '@repo/lib/shared/pages/TokenizedAssetsPage/TokenizedAssetsPage'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

export default async function TradePageWrapper() {
  return (
    <RoleGuard allowedRoles={['institutional', 'retail']} fallbackPath="/access-denied">
      <TokenizedAssetsPage />
    </RoleGuard>
  )
}
