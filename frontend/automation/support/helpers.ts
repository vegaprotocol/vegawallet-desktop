import type { Page } from '@playwright/test'

export async function unlockWallet(
  page: Page,
  name: string,
  passphrase: string
) {
  await page.getByTestId(`wallet-${name}`).click()
  await authenticate(page, passphrase)
}

export async function authenticate(page: Page, passphrase: string) {
  await page.getByTestId('passphrase-form').waitFor({ state: 'visible' })
  await page.getByTestId('input-passphrase').type(passphrase)
  await page.getByTestId('input-submit').click()
}
