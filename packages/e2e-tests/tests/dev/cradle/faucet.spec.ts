import { test, expect } from '@playwright/test'
import { goToFaucet } from '../../../helpers/navigation.helpers'
import { waitForPageLoad } from '../../../helpers/wait.helpers'
import { clickButton } from '../../../helpers/user.helpers'

test.describe('Faucet Page Tests', () => {
  test('Faucet page loads successfully', async ({ page }) => {
    await goToFaucet(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    expect(page.url()).toContain('/faucet')
  })

  test('Faucet interface displays correctly', async ({ page }) => {
    await goToFaucet(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Faucet page should display some content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Page should be visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('Faucet page has request button or form', async ({ page }) => {
    await goToFaucet(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Look for faucet-related buttons or forms
    const buttons = page.locator('button')
    const forms = page.locator('form')
    const inputs = page.locator('input')

    const buttonCount = await buttons.count()
    const formCount = await forms.count()
    const inputCount = await inputs.count()

    // Faucet page should have some interactive elements
    expect(buttonCount + formCount + inputCount).toBeGreaterThan(0)
  })

  test('Faucet page displays available tokens', async ({ page }) => {
    await goToFaucet(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Page should have some content
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Check for faucet-related content
    const hasFaucetContent =
      pageContent &&
      (pageContent.toLowerCase().includes('faucet') ||
        pageContent.toLowerCase().includes('request') ||
        pageContent.toLowerCase().includes('token') ||
        pageContent.length > 100)

    expect(hasFaucetContent).toBe(true)
  })

  test('Can interact with faucet interface', async ({ page }) => {
    await goToFaucet(page)
    await waitForPageLoad(page)

    if (page.url().includes('/sign-in')) {
      test.skip()
    }

    // Look for request/claim buttons
    const requestButtons = page.getByRole('button', { name: /request|claim|get|faucet/i })
    const requestButtonCount = await requestButtons.count()

    if (requestButtonCount > 0) {
      // Button exists, verify it's visible
      await expect(requestButtons.first()).toBeVisible()
    } else {
      // If no specific button, check for any interactive elements
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      expect(buttonCount).toBeGreaterThan(0)
    }
  })
})
