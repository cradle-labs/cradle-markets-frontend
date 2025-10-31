export {}

declare global {
  /**
   * User roles for role-based access control
   */
  type Roles = 'institutional' | 'retail'

  /**
   * Custom JWT session claims
   * This requires configuring Clerk Dashboard → Sessions → Customize session token:
   * {
   *   "metadata": {
   *     "role": "{{user.public_metadata.role}}"
   *   }
   * }
   */
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
