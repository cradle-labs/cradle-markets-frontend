'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function setRole(prevState: any, formData: FormData) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      console.log('No userId found in auth()')
      return { error: 'No user session found' }
    }

    const role = formData.get('role') as string

    if (!role) {
      return { error: 'Role is required' }
    }

    if (!['institution', 'retail'].includes(role)) {
      return { error: 'Invalid role. Must be "institution" or "retail"' }
    }

    // Allow users to set their own role if they don't have one yet
    const currentUserRole = sessionClaims?.metadata?.role
    const hasNoRole = !currentUserRole

    if (hasNoRole) {
      // User is setting their role for the first time - allow this
      const client = await clerkClient()

      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      })

      // Revalidate the path to ensure fresh data
      revalidatePath('/')
      revalidatePath('/select-role')

      // Return success state instead of redirecting
      return { success: true, role }
    } else {
      // User already has a role and is trying to change it
      return {
        error: 'Role already set. Contact support to change your role.',
      }
    }
  } catch (error) {
    console.error('Error setting user role:', error)
    return {
      error: `Failed to set user role: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
