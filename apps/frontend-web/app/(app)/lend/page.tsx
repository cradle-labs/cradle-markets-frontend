import { LendPage } from '@repo/lib/shared/pages/LendPage/LendPage'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

export default function LendPageWrapper() {
  return (
    <RoleGuard allowedRoles={['institution', 'retail']} fallbackPath="/access-denied">
      <LendPage />
    </RoleGuard>
  )
}
