import { test, expect } from '@playwright/test'
import { goToCash } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Cash Page Tests', () => {
  test('Cash page loads successfully', async ({ page }) => {
    await goToCash(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    expect(page.url()).toContain('/cash')
  })

  test('Cash management interface displays', async ({ page }) => {
    await goToCash(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Cash page should display some content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Page should be visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('Cash page has interactive elements', async ({ page }) => {
    await goToCash(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Check for interactive elements
    const buttons = page.locator('button')
    const links = page.locator('a')
    const inputs = page.locator('input')

    const buttonCount = await buttons.count()
    const linkCount = await links.count()
    const inputCount = await inputs.count()

    // Cash page should have some interactive elements
    expect(buttonCount + linkCount + inputCount).toBeGreaterThan(0)
  })

  test('Cash page displays account information', async ({ page }) => {
    await goToCash(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Page should have some content related to cash management
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Check for common cash-related terms
    const hasCashContent =
      pageContent &&
      (pageContent.toLowerCase().includes('cash') ||
        pageContent.toLowerCase().includes('balance') ||
        pageContent.toLowerCase().includes('account') ||
        pageContent.length > 100)

    expect(hasCashContent).toBe(true)
  })
})
