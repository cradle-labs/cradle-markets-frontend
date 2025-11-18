import { Page, expect } from '@playwright/test'

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Wait for element to be visible with custom timeout
 */
export async function waitForVisible(
  page: Page,
  selector: string,
  timeout: number = 10000,
): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout })
}

/**
 * Wait for element to be hidden
 */
export async function waitForHidden(
  page: Page,
  selector: string,
  timeout: number = 10000,
): Promise<void> {
  await page.waitForSelector(selector, { state: 'hidden', timeout })
}

/**
 * Wait for text to appear on page
 */
export async function waitForText(
  page: Page,
  text: string,
  timeout: number = 10000,
): Promise<void> {
  await expect(page.getByText(text)).toBeVisible({ timeout })
}

/**
 * Wait for URL to match pattern
 */
export async function waitForUrl(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000,
): Promise<void> {
  if (typeof urlPattern === 'string') {
    await page.waitForURL(urlPattern, { timeout })
  } else {
    await page.waitForURL(urlPattern, { timeout })
  }
}

/**
 * Wait for network request to complete
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 30000) {
  await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Wait for a specific amount of time
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wait for element to be enabled
 */
export async function waitForEnabled(
  page: Page,
  selector: string,
  timeout: number = 10000,
): Promise<void> {
  await page.waitForSelector(selector, { state: 'attached', timeout })
  const element = page.locator(selector)
  await expect(element).toBeEnabled({ timeout })
}
