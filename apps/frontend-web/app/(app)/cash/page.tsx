import { CashPage } from '@repo/lib/shared/pages/CashPage/CashPage'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

export default function CashPageWrapper() {
  return (
    <RoleGuard allowedRoles={['institutional', 'retail']} fallbackPath="/access-denied">
      <CashPage />
    </RoleGuard>
  )
}
