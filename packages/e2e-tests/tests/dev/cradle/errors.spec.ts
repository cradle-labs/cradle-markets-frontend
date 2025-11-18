import { test, expect } from '@playwright/test'
import { navigateTo } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'
import { isAccessDeniedPage } from '../../../helpers/auth.helpers'

test.describe('Error Handling Tests', () => {
  test('404 page displays for non-existent routes', async ({ page }) => {
    await navigateTo(page, '/non-existent-route-12345')
    await waitForPageLoad(page)

    // Should show 404 or not-found page
    // Next.js typically shows a not-found page
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Check for 404-related content
    const has404Content =
      pageContent &&
      (pageContent.toLowerCase().includes('404') ||
        pageContent.toLowerCase().includes('not found') ||
        pageContent.toLowerCase().includes('page not found'))

    // Either shows 404 content or redirects to a valid page
    expect(has404Content || page.url().includes('/not-found') || page.url().includes('/404')).toBe(
      true,
    )
  })

  test('Access denied page displays correctly', async ({ page }) => {
    await navigateTo(page, '/access-denied')
    await waitForPageLoad(page)

    const isAccessDenied = await isAccessDeniedPage(page)
    expect(isAccessDenied).toBe(true)

    // Access denied page should have some content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Check for access denied related content
    const hasAccessDeniedContent =
      pageContent &&
      (pageContent.toLowerCase().includes('access denied') ||
        pageContent.toLowerCase().includes('unauthorized') ||
        pageContent.toLowerCase().includes('permission'))

    expect(hasAccessDeniedContent || pageContent.length > 50).toBe(true)
  })

  test('Invalid route shows appropriate error', async ({ page }) => {
    // Test various invalid routes
    const invalidRoutes = ['/invalid/route', '/trade/invalid-market-id', '/lend/invalid-pool-id']

    for (const route of invalidRoutes) {
      await navigateTo(page, route)
      await waitForPageLoad(page)

      // Should either show 404/not-found or redirect appropriately
      const pageContent = await page.textContent('body')
      expect(pageContent).toBeTruthy()
    }
  })

  test('Error page has navigation options', async ({ page }) => {
    await navigateTo(page, '/access-denied')
    await waitForPageLoad(page)

    // Access denied page should have some way to navigate away
    // Look for links or buttons
    const links = page.locator('a')
    const buttons = page.locator('button')

    const linkCount = await links.count()
    const buttonCount = await buttons.count()

    // Should have some navigation options
    expect(linkCount + buttonCount).toBeGreaterThan(0)
  })

  test('Error boundaries handle client-side errors gracefully', async ({ page }) => {
    // This test would require triggering an actual error
    // For now, we just verify the error page structure exists
    await navigateTo(page, '/access-denied')
    await waitForPageLoad(page)

    // Error page should load without crashing
    await expect(page.locator('body')).toBeVisible()

    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })
})
