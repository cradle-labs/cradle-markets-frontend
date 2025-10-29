import Portfolio from '@repo/lib/modules/portfolio/Portfolio'
import { RoleGuard } from '@/lib/components/auth/RoleGuard'

export default function PortfolioPage() {
  return (
    <RoleGuard allowedRoles={['institution', 'retail']} fallbackPath="/access-denied">
      <Portfolio />
    </RoleGuard>
  )
}
