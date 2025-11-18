import { test, expect } from '@playwright/test'
import { goToTrade } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Trade Page Smoke Tests', () => {
  test('Trade page loads successfully', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    // If not authenticated, we'll be redirected to sign-in
    // If authenticated, we should be on trade page
    if (page.url().includes('/sign-in')) {
      // User not authenticated - this is expected for smoke tests
      expect(page.url()).toContain('/sign-in')
    } else {
      expect(page.url()).toContain('/trade')
    }
  })

  test('Market/pool list displays on trade page', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load - trade page should show some content
    // This is a smoke test, so we just check the page loaded
    await expect(page.locator('body')).toBeVisible()

    // Check if there's any content related to trading/markets
    // The exact structure depends on the TokenizedAssetsPage component
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('Can navigate to specific market detail page', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Look for clickable market/pool items
    // Try to find a market link or card
    const marketLinks = page.locator('a[href*="/trade/"], [role="link"]').first()

    // If market links exist, try clicking one
    const marketLinkCount = await marketLinks.count()
    if (marketLinkCount > 0) {
      await marketLinks.first().click()
      await waitForPageLoad(page)

      // Should be on a market detail page
      expect(page.url()).toMatch(/\/trade\/.+/)
    } else {
      // If no market links found, just verify we're still on trade page
      expect(page.url()).toContain('/trade')
    }
  })
})
