import { ListingsPage } from '@repo/lib/shared/pages'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

export default function ListingsPageWrapper() {
  return (
    <RoleGuard allowedRoles={['institutional', 'retail']} fallbackPath="/access-denied">
      <ListingsPage />
    </RoleGuard>
  )
}
