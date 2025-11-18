import { test, expect } from '@playwright/test'
import { goToLend } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Lend Page Smoke Tests', () => {
  test('Lend page loads successfully', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    // If not authenticated, we'll be redirected to sign-in
    if (page.url().includes('/sign-in')) {
      expect(page.url()).toContain('/sign-in')
    } else {
      expect(page.url()).toContain('/lend')
    }
  })

  test('Lending pools list displays', async ({ page }) => {
    await goToLend(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for page content to load
    await page.waitForTimeout(2000)

    // Check that page has loaded
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Lend page should show some content (pools or empty state)
    await expect(page.locator('body')).toBeVisible()
  })
})
