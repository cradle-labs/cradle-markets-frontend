import { Page } from '@playwright/test'
import { clickButton, button } from './user.helpers'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

export type UserRole = 'institutional' | 'retail'

/**
 * Navigate to sign-in page
 */
export async function goToSignIn(page: Page) {
  await page.goto(`${BASE_URL}/sign-in`)
}

/**
 * Navigate to sign-up page
 */
export async function goToSignUp(page: Page) {
  await page.goto(`${BASE_URL}/sign-up`)
}

/**
 * Navigate to select-role page
 */
export async function goToSelectRole(page: Page) {
  await page.goto(`${BASE_URL}/select-role`)
}

/**
 * Wait for Clerk sign-in form to be visible
 */
export async function waitForSignInForm(page: Page) {
  // Clerk forms typically have these identifiers
  await page.waitForSelector('[data-testid="clerk-sign-in"], form', { timeout: 10000 })
}

/**
 * Wait for Clerk sign-up form to be visible
 */
export async function waitForSignUpForm(page: Page) {
  await page.waitForSelector('[data-testid="clerk-sign-up"], form', { timeout: 10000 })
}

/**
 * Check if user is redirected to sign-in page
 */
export async function isRedirectedToSignIn(page: Page): Promise<boolean> {
  await page.waitForURL(/.*\/sign-in.*/, { timeout: 5000 }).catch(() => {})
  return page.url().includes('/sign-in')
}

/**
 * Check if user is redirected to select-role page
 */
export async function isRedirectedToSelectRole(page: Page): Promise<boolean> {
  await page.waitForURL(/.*\/select-role.*/, { timeout: 5000 }).catch(() => {})
  return page.url().includes('/select-role')
}

/**
 * Check if user is redirected to trade page
 */
export async function isRedirectedToTrade(page: Page): Promise<boolean> {
  await page.waitForURL(/.*\/trade.*/, { timeout: 5000 }).catch(() => {})
  return page.url().includes('/trade')
}

/**
 * Select a role on the select-role page
 */
export async function selectRole(page: Page, role: UserRole) {
  const roleButtonText = role === 'institutional' ? 'Select Institutional' : 'Select Retail'
  await clickButton(page, roleButtonText)

  // Wait for navigation to trade page after role selection
  await page.waitForURL(/.*\/trade.*/, { timeout: 15000 }).catch(() => {})
}

/**
 * Check if role selection buttons are visible
 */
export async function areRoleButtonsVisible(page: Page): Promise<boolean> {
  const institutionalButton = button(page, 'Select Institutional')
  const retailButton = button(page, 'Select Retail')

  try {
    const institutionalVisible = await institutionalButton.isVisible({ timeout: 5000 })
    const retailVisible = await retailButton.isVisible({ timeout: 5000 })
    return institutionalVisible && retailVisible
  } catch {
    return false
  }
}

/**
 * Check if access denied page is displayed
 */
export async function isAccessDeniedPage(page: Page): Promise<boolean> {
  await page.waitForURL(/.*\/access-denied.*/, { timeout: 5000 }).catch(() => {})
  return page.url().includes('/access-denied')
}
