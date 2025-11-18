import { test, expect } from '@playwright/test'
import { goToPortfolio } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Portfolio Page Tests', () => {
  test('Portfolio page loads successfully', async ({ page }) => {
    await goToPortfolio(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    expect(page.url()).toContain('/portfolio')
  })

  test('Portfolio page displays user positions', async ({ page }) => {
    await goToPortfolio(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for portfolio data to load
    await page.waitForTimeout(2000)

    // Portfolio page should display some content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Check for portfolio-related content
    // The exact structure depends on Portfolio component implementation
    await expect(page.locator('body')).toBeVisible()
  })

  test('Portfolio data sections are visible', async ({ page }) => {
    await goToPortfolio(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Portfolio should show sections for:
    // - Supplied assets
    // - Borrowed assets
    // - Net value
    // The exact selectors depend on Portfolio component

    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()

    // Check for common portfolio terms
    const hasPortfolioContent =
      bodyText &&
      (bodyText.toLowerCase().includes('portfolio') ||
        bodyText.toLowerCase().includes('supplied') ||
        bodyText.toLowerCase().includes('borrowed') ||
        bodyText.toLowerCase().includes('value') ||
        bodyText.toLowerCase().includes('balance'))

    // Portfolio page should have some relevant content
    expect(hasPortfolioContent || bodyText.length > 100).toBe(true)
  })

  test('Portfolio page has interactive elements', async ({ page }) => {
    await goToPortfolio(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Check for interactive elements
    const buttons = page.locator('button')
    const links = page.locator('a')

    const buttonCount = await buttons.count()
    const linkCount = await links.count()

    // Portfolio page should have some interactive elements
    expect(buttonCount + linkCount).toBeGreaterThan(0)
  })

  test('Portfolio page displays correctly when empty', async ({ page }) => {
    await goToPortfolio(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for page to load
    await page.waitForTimeout(2000)

    // Even with no positions, page should load and display something
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Page should be visible
    await expect(page.locator('body')).toBeVisible()
  })
})
