import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/utils/roles'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: Roles[]
  fallbackPath?: string
}

/**
 * Server component that protects content based on user roles
 */
export async function RoleGuard({ children, allowedRoles, fallbackPath = '/' }: RoleGuardProps) {
  const userRole = await getUserRole()

  // If user has no role or role is not allowed, redirect
  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect(fallbackPath)
  }

  return <>{children}</>
}

/**
 * Higher-order component for role-based access control
 */
export function withRoleGuard<T extends object>(
  Component: React.ComponentType<T>,
  allowedRoles: Roles[],
  fallbackPath?: string
) {
  return async function ProtectedComponent(props: T) {
    return (
      <RoleGuard allowedRoles={allowedRoles} fallbackPath={fallbackPath}>
        <Component {...props} />
      </RoleGuard>
    )
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: Roles[]): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole ? roles.includes(userRole) : false
}

/**
 * Conditional rendering based on user role
 */
interface RoleBasedRenderProps {
  children: ReactNode
  allowedRoles: Roles[]
  fallback?: ReactNode
}

export async function RoleBasedRender({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedRenderProps) {
  const hasAccess = await hasAnyRole(allowedRoles)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
