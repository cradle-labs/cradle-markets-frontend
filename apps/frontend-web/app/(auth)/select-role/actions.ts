'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createAccount } from '@repo/lib/actions/accounts'
import type { CradleAccountType } from '@repo/lib/cradle-client-ts/cradle-api-client'

interface SetRoleResult {
  error?: string
  success?: boolean
  role?: string
  accountId?: string
  partialSuccess?: boolean
}

export async function setRole(prevState: any, formData: FormData): Promise<SetRoleResult> {
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

    if (!['institutional', 'retail'].includes(role)) {
      return { error: 'Invalid role. Must be "institutional" or "retail"' }
    }

    // Allow users to set their own role if they don't have one yet
    const currentUserRole = sessionClaims?.metadata?.role
    const hasNoRole = !currentUserRole

    if (hasNoRole) {
      // User is setting their role for the first time - allow this
      const client = await clerkClient()

      // Update Clerk metadata
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      })

      // Create Cradle account
      const accountType: CradleAccountType = role === 'institutional' ? 'institutional' : 'retail'
      const accountResult = await createAccount({
        linked_account_id: userId,
        account_type: accountType,
      })

      if (!accountResult.success) {
        // Role was set but account creation failed
        console.error('Account creation failed:', accountResult.error)
        return {
          partialSuccess: true,
          success: true,
          role,
          error: 'Role set successfully, but account creation failed. Please contact support.',
        }
      }

      // Return success state with account ID
      return {
        success: true,
        role,
        accountId: accountResult.accountId,
      }
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
