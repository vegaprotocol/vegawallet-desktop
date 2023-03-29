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

export async function waitForNetworkConnected(page: Page) {
  const serviceStatus = page.getByTestId('service-status')
  await expect(serviceStatus).not.toContainText(/^(Not running|Loading)$/, {
    timeout: 30 * 1000
  })
}
