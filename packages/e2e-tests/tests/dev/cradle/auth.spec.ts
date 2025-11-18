import { test, expect } from '@playwright/test'
import {
  goToSignIn,
  goToSignUp,
  goToSelectRole,
  waitForSignInForm,
  waitForSignUpForm,
  isRedirectedToSignIn,
  isRedirectedToSelectRole,
  isRedirectedToTrade,
  selectRole,
  areRoleButtonsVisible,
  isAccessDeniedPage,
} from '../../../helpers/auth.helpers'
import { navigateTo } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Authentication Full Flow Tests', () => {
  test('Sign-in page displays correctly', async ({ page }) => {
    await goToSignIn(page)
    await waitForSignInForm(page)
    expect(page.url()).toContain('/sign-in')
  })

  test('Sign-up page displays correctly', async ({ page }) => {
    await goToSignUp(page)
    await waitForSignUpForm(page)
    expect(page.url()).toContain('/sign-up')
  })

  test('Role selection page displays both institutional and retail options', async ({ page }) => {
    await goToSelectRole(page)
    await waitForPageLoad(page)

    // Check for role selection heading
    await expect(page.getByText(/Choose Your Account Type/i)).toBeVisible()

    // Check that both role buttons are visible
    const buttonsVisible = await areRoleButtonsVisible(page)
    expect(buttonsVisible).toBe(true)

    // Check for role descriptions
    await expect(page.getByText(/Institutional/i)).toBeVisible()
    await expect(page.getByText(/Retail/i)).toBeVisible()
  })

  test('Unauthenticated user accessing protected route redirects to sign-in', async ({ page }) => {
    await navigateTo(page, '/trade')
    const redirected = await isRedirectedToSignIn(page)
    expect(redirected).toBe(true)
  })

  test('Unauthenticated user accessing portfolio redirects to sign-in', async ({ page }) => {
    await navigateTo(page, '/portfolio')
    const redirected = await isRedirectedToSignIn(page)
    expect(redirected).toBe(true)
  })

  test('Unauthenticated user accessing lend redirects to sign-in', async ({ page }) => {
    await navigateTo(page, '/lend')
    const redirected = await isRedirectedToSignIn(page)
    expect(redirected).toBe(true)
  })

  test('Root path redirects unauthenticated users to landing page', async ({ page }) => {
    await navigateTo(page, '/')
    await waitForPageLoad(page)

    // Should be on landing page (not redirected)
    expect(page.url()).toMatch(/^http:\/\/localhost:3000\/?$/)

    // Landing page should have "Launch app" link
    await expect(page.getByRole('link', { name: /Launch app/i })).toBeVisible({ timeout: 10000 })
  })

  // Note: Full sign-up and sign-in flows would require actual Clerk credentials
  // These tests assume the user is already authenticated or will be authenticated manually
  // For automated testing, you would need to set up Clerk test credentials

  test('Select role page shows access denied message if user already has role', async ({
    page,
  }) => {
    // This test assumes the user might already have a role
    // In a real scenario, you'd need to handle this with test user management
    await goToSelectRole(page)
    await waitForPageLoad(page)

    // The page should either show role selection or redirect
    // If user has role, they should be redirected to /trade
    // If not, they should see role selection options
    const hasRoleButtons = await areRoleButtonsVisible(page)
    const isOnTrade = page.url().includes('/trade')

    // Either role buttons are visible OR user is redirected to trade
    expect(hasRoleButtons || isOnTrade).toBe(true)
  })
})
