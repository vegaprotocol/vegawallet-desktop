import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/commands/init-app'
import restoreWallet from '../support/commands/restore-wallet'
import { authenticate, unlockWallet } from '../support/helpers'

const passphrase = process.env.testWalletPassphrase as string
const walletName = process.env.testWalletName as string
const pubkey = process.env.testWalletPublicKey as string

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
    await expect(
      page.getByTestId('keypair-taint-notification')
    ).toBeHidden()
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
