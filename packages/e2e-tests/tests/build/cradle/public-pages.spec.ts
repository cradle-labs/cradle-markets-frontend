import { test, expect } from '@playwright/test'
import { navigateTo } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'

test.describe('Public Pages Smoke Tests', () => {
  test('Terms of use page loads', async ({ page }) => {
    await navigateTo(page, '/terms-of-use')
    await waitForPageLoad(page)

    expect(page.url()).toContain('/terms-of-use')

    // Page should have content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('Privacy policy page loads', async ({ page }) => {
    await navigateTo(page, '/privacy-policy')
    await waitForPageLoad(page)

    expect(page.url()).toContain('/privacy-policy')

    // Page should have content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('Cookies policy page loads', async ({ page }) => {
    await navigateTo(page, '/cookies-policy')
    await waitForPageLoad(page)

    expect(page.url()).toContain('/cookies-policy')

    // Page should have content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('Risks page loads', async ({ page }) => {
    await navigateTo(page, '/risks')
    await waitForPageLoad(page)

    expect(page.url()).toContain('/risks')

    // Page should have content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('3rd-party services page loads', async ({ page }) => {
    await navigateTo(page, '/3rd-party-services')
    await waitForPageLoad(page)

    expect(page.url()).toContain('/3rd-party-services')

    // Page should have content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
  })

  test('Components page loads (if public)', async ({ page }) => {
    await navigateTo(page, '/components')
    await waitForPageLoad(page)

    // Components page might be public or protected
    // If protected, we'll be redirected to sign-in
    if (page.url().includes('/sign-in')) {
      // Page is protected, which is fine
      expect(page.url()).toContain('/sign-in')
    } else {
      // Page is public
      expect(page.url()).toContain('/components')
      const pageContent = await page.textContent('body')
      expect(pageContent).toBeTruthy()
    }
  })
})
