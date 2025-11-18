import { test, expect } from '@playwright/test'
import {
  goToSignIn,
  goToSignUp,
  waitForSignInForm,
  waitForSignUpForm,
  isRedirectedToSignIn,
} from '../../../helpers/auth.helpers'
import { navigateTo } from '../../../helpers/navigation.helpers'

test.describe('Authentication Smoke Tests', () => {
  test('Landing page is accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await expect(page).toHaveTitle(/Cradle/i)
  })

  test('Unauthenticated user redirected to sign-in when accessing protected route', async ({
    page,
  }) => {
    // Try to access a protected route
    await navigateTo(page, '/trade')

    // Should be redirected to sign-in
    const redirected = await isRedirectedToSignIn(page)
    expect(redirected).toBe(true)
  })

  test('Sign-in page loads and displays correctly', async ({ page }) => {
    await goToSignIn(page)
    await waitForSignInForm(page)

    // Check that we're on the sign-in page
    expect(page.url()).toContain('/sign-in')

    // Clerk sign-in component should be present
    const signInForm = page.locator('form, [data-testid="clerk-sign-in"]').first()
    await expect(signInForm).toBeVisible({ timeout: 10000 })
  })

  test('Sign-up page loads and displays correctly', async ({ page }) => {
    await goToSignUp(page)
    await waitForSignUpForm(page)

    // Check that we're on the sign-up page
    expect(page.url()).toContain('/sign-up')

    // Clerk sign-up component should be present
    const signUpForm = page.locator('form, [data-testid="clerk-sign-up"]').first()
    await expect(signUpForm).toBeVisible({ timeout: 10000 })
  })
})
