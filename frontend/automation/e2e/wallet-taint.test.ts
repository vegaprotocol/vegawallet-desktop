import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import { authenticate, unlockWallet } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'
const passphrase = data.testWalletPassphrase
const walletName = data.testWalletName
const pubkey = data.testWalletPublicKey

test.describe('wallet taint key', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await restoreWallet(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
  })

  test('message taint success', async () => {
    // 0001-WALL-061 must select a key to un-taint and be required to enter wallet password
    // 0001-WALL-058 must be prompted to enter wallet password to taint key
    // 0001-WALL-060 I can see tainted keys flagged as tainted
    await unlockWallet(page, walletName, passphrase)
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()

    await page.getByTestId('keypair-taint-toggle').click()
    await page.getByTestId('taint-action').click()
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'This key has been tainted'
    )
    await expect(page.getByTestId('keypair-taint-notification')).toBeVisible()
  })

  test('message untaint success', async () => {
    // 0001-WALL-061 must select a key to un-taint and be required to enter wallet password
    await unlockWallet(page, walletName, passphrase)
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await page.getByTestId('keypair-taint-toggle').click()
    await page.getByTestId('taint-action').click()
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'This key has been untainted'
    )
    await expect(page.getByTestId('keypair-taint-notification')).toBeHidden()
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
