import { Page } from '@playwright/test'
import { clickLink } from './user.helpers'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

/**
 * Navigate to a specific route
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(`${BASE_URL}${path}`)
}

/**
 * Navigate to trade page
 */
export async function goToTrade(page: Page) {
  await navigateTo(page, '/trade')
}

/**
 * Navigate to lend page
 */
export async function goToLend(page: Page) {
  await navigateTo(page, '/lend')
}

/**
 * Navigate to portfolio page
 */
export async function goToPortfolio(page: Page) {
  await navigateTo(page, '/portfolio')
}

/**
 * Navigate to faucet page
 */
export async function goToFaucet(page: Page) {
  await navigateTo(page, '/faucet')
}

/**
 * Navigate to perps page
 */
export async function goToPerps(page: Page) {
  await navigateTo(page, '/perps')
}

/**
 * Click on a navigation link by text
 */
export async function clickNavLink(page: Page, linkText: string) {
  await clickLink(page, linkText)
}

/**
 * Check if a navigation link is visible
 */
export async function isNavLinkVisible(page: Page, linkText: string): Promise<boolean> {
  try {
    const link = page.getByRole('link', { name: new RegExp(`^${linkText}$`, 'i') })
    await link.waitFor({ timeout: 5000 })
    return await link.isVisible()
  } catch {
    return false
  }
}

/**
 * Check if current page matches the expected path
 */
export async function isOnPage(page: Page, path: string): Promise<boolean> {
  await page.waitForLoadState('networkidle')
  return page.url().includes(path)
}

/**
 * Get all visible navigation links
 */
export async function getVisibleNavLinks(page: Page): Promise<string[]> {
  const navLinks = ['Trade', 'Lend', 'Portfolio', 'Faucet']
  const visibleLinks: string[] = []

  for (const link of navLinks) {
    if (await isNavLinkVisible(page, link)) {
      visibleLinks.push(link)
    }
  }

  return visibleLinks
}
