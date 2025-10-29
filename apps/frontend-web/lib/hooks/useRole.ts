'use client'

import { useUser } from '@clerk/nextjs'

/**
 * Client-side hook for accessing user role information
 */
export function useRole() {
  const { user } = useUser()

  const role = user?.publicMetadata?.role as Roles | undefined

  return {
    role,
    isInstitution: role === 'institution',
    isRetail: role === 'retail',
    hasRole: (requiredRole: Roles) => role === requiredRole,
    hasAnyRole: (roles: Roles[]) => (role ? roles.includes(role) : false),
  }
}
