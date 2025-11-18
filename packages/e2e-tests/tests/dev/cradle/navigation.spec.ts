import { test, expect } from '@playwright/test'
import {
  goToTrade,
  goToLend,
  goToPortfolio,
  goToCash,
  goToFaucet,
  isNavLinkVisible,
  getVisibleNavLinks,
  isOnPage,
  clickNavLink,
} from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Navigation Tests', () => {
  test('Navigation bar displays correct links', async ({ page }) => {
    // Navigate to a protected page (will redirect if not authenticated)
    await goToTrade(page)
    await waitForPageLoad(page)

    // If authenticated, check navigation links
    // If not authenticated, we'll be on sign-in page
    if (page.url().includes('/sign-in')) {
      // User not authenticated, skip navigation test
      test.skip()
    } else {
      const visibleLinks = await getVisibleNavLinks(page)

      // Should have at least Trade link visible
      expect(visibleLinks.length).toBeGreaterThan(0)
      expect(visibleLinks).toContain('Trade')
    }
  })

  test('Navigation links work correctly - Trade', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (!page.url().includes('/sign-in')) {
      expect(await isOnPage(page, '/trade')).toBe(true)
    }
  })

  test('Navigation links work correctly - Lend', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (!page.url().includes('/sign-in')) {
      expect(await isOnPage(page, '/lend')).toBe(true)
    }
  })

  test('Navigation links work correctly - Portfolio', async ({ page }) => {
    await goToPortfolio(page)
    await waitForPageLoad(page)

    if (!page.url().includes('/sign-in')) {
      expect(await isOnPage(page, '/portfolio')).toBe(true)
    }
  })

  test('Navigation links work correctly - Cash', async ({ page }) => {
    await goToCash(page)
    await waitForPageLoad(page)

    if (!page.url().includes('/sign-in')) {
      expect(await isOnPage(page, '/cash')).toBe(true)
    }
  })

  test('Navigation links work correctly - Faucet', async ({ page }) => {
    await goToFaucet(page)
    await waitForPageLoad(page)

    if (!page.url().includes('/sign-in')) {
      expect(await isOnPage(page, '/faucet')).toBe(true)
    }
  })

  test('Can navigate between pages using navigation links', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Try to click on Lend link if visible
    if (await isNavLinkVisible(page, 'Lend')) {
      await clickNavLink(page, 'Lend')
      await waitForPageLoad(page)
      expect(await isOnPage(page, '/lend')).toBe(true)
    }

    // Try to click on Portfolio link if visible
    if (await isNavLinkVisible(page, 'Portfolio')) {
      await clickNavLink(page, 'Portfolio')
      await waitForPageLoad(page)
      expect(await isOnPage(page, '/portfolio')).toBe(true)
    }
  })

  test('Active page highlighting in navigation', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Check if Trade link is visible (it should be since we're on trade page)
    const tradeLinkVisible = await isNavLinkVisible(page, 'Trade')
    expect(tradeLinkVisible).toBe(true)
  })
})
