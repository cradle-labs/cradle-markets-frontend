import { RoleGuard } from '@/lib/components/auth/RoleGuard'
import { FaucetPage } from '@repo/lib/shared/pages/FaucetPage/FaucetPage'

import React from 'react'

const Faucet = () => {
  return (
    <RoleGuard allowedRoles={['institutional', 'retail']} fallbackPath="/access-denied">
      <FaucetPage />
    </RoleGuard>
  )
}

export default Faucet
