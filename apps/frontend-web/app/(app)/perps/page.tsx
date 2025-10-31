import { PerpsPage } from '@repo/lib/shared/pages/PerpsPage/PerpsPage'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

export default function PerpsPageWrapper() {
  return (
    <RoleGuard allowedRoles={['institution', 'retail']} fallbackPath="/access-denied">
      <PerpsPage />
    </RoleGuard>
  )
}
