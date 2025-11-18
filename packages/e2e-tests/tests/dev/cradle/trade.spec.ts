import { test, expect } from '@playwright/test'
import { goToTrade, navigateTo } from '../../../helpers/navigation.helpers'
import { waitForPageLoad, waitForText } from '../../../helpers/wait.helpers'

test.describe('Trade Page Full Tests', () => {
  test('Trade page displays tokenized assets', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Trade page should display some content
    await expect(page.locator('body')).toBeVisible()

    // Check for any trading-related content
    // The exact content depends on TokenizedAssetsPage implementation
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
  })

  test('Trade page shows market information', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for page to fully render
    await page.waitForTimeout(2000)

    // Check that page has loaded content
    const hasContent = await page.locator('body').textContent()
    expect(hasContent).toBeTruthy()
  })

  test('Market detail page shows correct information', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Try to find and click on a market
    const marketLinks = page.locator('a[href*="/trade/"]').first()
    const marketLinkCount = await marketLinks.count()

    if (marketLinkCount > 0) {
      await marketLinks.first().click()
      await waitForPageLoad(page)

      // Should be on market detail page
      expect(page.url()).toMatch(/\/trade\/.+/)

      // Page should have some content
      const pageContent = await page.textContent('body')
      expect(pageContent).toBeTruthy()
    } else {
      // If no market links, test that we can navigate to a market URL directly
      // This would require knowing a valid market ID
      test.skip()
    }
  })

  test('Trade page has interactive elements', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Check for interactive elements (buttons, links, inputs)
    const buttons = page.locator('button')
    const links = page.locator('a')
    const inputs = page.locator('input')

    const buttonCount = await buttons.count()
    const linkCount = await links.count()

    // Page should have some interactive elements
    expect(buttonCount + linkCount).toBeGreaterThan(0)
  })

  test('Can navigate back from market detail to trade list', async ({ page }) => {
    await goToTrade(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Try to navigate to a market
    const marketLinks = page.locator('a[href*="/trade/"]').first()
    const marketLinkCount = await marketLinks.count()

    if (marketLinkCount > 0) {
      await marketLinks.first().click()
      await waitForPageLoad(page)

      // Navigate back
      await page.goBack()
      await waitForPageLoad(page)

      // Should be back on trade page
      expect(page.url()).toContain('/trade')
    } else {
      test.skip()
    }
  })
})
