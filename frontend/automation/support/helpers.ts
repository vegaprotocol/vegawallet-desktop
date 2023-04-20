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
export async function waitForNetworkConnected(page: Page, network?: string) {
  const timeout = 10 * 1000
  const serviceStatus = page.getByTestId('service-status')
  const expectedString = `Wallet Service: ${network || 'test'}`
  try {
    await expect(serviceStatus).toContainText(expectedString, {
      timeout
    })
  } catch (e) {
    await page.goto('/')
    await expect(serviceStatus).toContainText(expectedString, {
      timeout: 2 * timeout
    })
  }
}
