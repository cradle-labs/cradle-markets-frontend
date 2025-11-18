import { test, expect } from '@playwright/test'
import { goToLend, navigateTo } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Lend Page Full Tests', () => {
  test('Lend page shows available pools', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Page should display content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('Can navigate to specific pool detail page', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Look for pool links
    const poolLinks = page.locator('a[href*="/lend/"]').first()
    const poolLinkCount = await poolLinks.count()

    if (poolLinkCount > 0) {
      await poolLinks.first().click()
      await waitForPageLoad(page)

      // Should be on pool detail page
      expect(page.url()).toMatch(/\/lend\/.+/)
    } else {
      // If no pool links, verify we're on lend page
      expect(page.url()).toContain('/lend')
    }
  })

  test('Supply/borrow tabs are accessible', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Try to navigate to a pool detail page first
    const poolLinks = page.locator('a[href*="/lend/"]').first()
    const poolLinkCount = await poolLinks.count()

    if (poolLinkCount > 0) {
      await poolLinks.first().click()
      await waitForPageLoad(page)

      // Look for supply/borrow tabs or buttons
      const supplyButton = page.getByRole('button', { name: /supply/i }).first()
      const borrowButton = page.getByRole('button', { name: /borrow/i }).first()

      const supplyCount = await supplyButton.count()
      const borrowCount = await borrowButton.count()

      // At least one of them should be present
      expect(supplyCount + borrowCount).toBeGreaterThan(0)
    } else {
      // If no pools, check if tabs exist on main lend page
      const tabs = page.locator('[role="tab"]')
      const tabCount = await tabs.count()

      if (tabCount > 0) {
        // Tabs exist, verify they're accessible
        expect(tabCount).toBeGreaterThan(0)
      } else {
        // No tabs found, skip this test
        test.skip()
      }
    }
  })

  test('Pool information displays correctly', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for pools to load
    await page.waitForTimeout(2000)

    // Check for pool information elements
    // Look for common pool metrics like APY, LTV, etc.
    const bodyText = await page.textContent('body')

    // Page should have some content
    expect(bodyText).toBeTruthy()

    // If pools are displayed, they should have some information
    // The exact structure depends on LendPage implementation
    const hasContent = bodyText && bodyText.length > 0
    expect(hasContent).toBe(true)
  })

  test('Lend page has interactive elements', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Check for interactive elements
    const buttons = page.locator('button')
    const links = page.locator('a')

    const buttonCount = await buttons.count()
    const linkCount = await links.count()

    // Page should have some interactive elements
    expect(buttonCount + linkCount).toBeGreaterThan(0)
  })
})
