import { clerkClient, currentUser } from '@clerk/nextjs/server'

/**
 * Check if the current user has a specific role
 * @param role - The role to check for
 * @returns Promise<boolean> - Whether the user has the role
 */
export const checkRole = async (role: Roles): Promise<boolean> => {
  const user = await currentUser()
  return user?.publicMetadata?.role === role
}

/**
 * Get the current user's role
 * @returns Promise<Roles | undefined> - The user's role or undefined if not set
 */
export const getUserRole = async (): Promise<Roles | undefined> => {
  const user = await currentUser()
  return user?.publicMetadata?.role as Roles | undefined
}

/**
 * Check if the current user is an institution
 * @returns Promise<boolean>
 */
export const isInstitution = async (): Promise<boolean> => {
  return checkRole('institution')
}

/**
 * Check if the current user is retail
 * @returns Promise<boolean>
 */
export const isRetail = async (): Promise<boolean> => {
  return checkRole('retail')
}

/**
 * Set a user's role (admin function)
 * @param userId - The user ID to update
 * @param role - The role to assign
 */
export const setUserRole = async (userId: string, role: Roles) => {
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  })
}

/**
 * Remove a user's role (admin function)
 * @param userId - The user ID to update
 */
export const removeUserRole = async (userId: string) => {
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: undefined,
    },
  })
}
