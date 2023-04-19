import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function authenticate(page: Page, passphrase: string) {
  await page.getByTestId('passphrase-form').waitFor({ state: 'visible' })
  await page.getByTestId('input-passphrase').type(passphrase)
  await page.getByTestId('input-submit').click()
}

export async function getTextFromClipboard(page: Page): Promise<string> {
  return page.evaluate('navigator.clipboard.readText()')
}

export function isMainnetConfiguration() {
  return (
    process.env.VITE_FEATURE_MODE === 'mainnet' ||
    process.env.VITE_FEATURE_MODE === '' ||
    process.env.VITE_FEATURE_MODE === undefined
  )
}

export function isFairgroundConfiguration() {
  return process.env.VITE_FEATURE_MODE === 'fairground'
}

export async function unlockWallet(
  page: Page,
  name: string,
  passphrase: string
) {
  await page.getByTestId(`wallet-${name}`).click()
  await authenticate(page, passphrase)
}

// This function usage would be probably possible to remove in most of the places
// after https://github.com/vegaprotocol/vegawallet-desktop/issues/589 is resolved
export async function waitForNetworkConnected(page: Page) {
  const timeout = 5 * 1000
  const serviceStatus = page.getByTestId('service-status')
  try {
    await expect(serviceStatus).not.toContainText(
      /^(Not running|Loading|Not reachable)$/,
      {
        timeout
      }
    )
  } catch (e) {
    await page.goto('/')
    await expect(serviceStatus).not.toContainText(
      /^(Not running|Loading|Not reachable)$/,
      {
        timeout: 2 * timeout
      }
    )
  }
}
