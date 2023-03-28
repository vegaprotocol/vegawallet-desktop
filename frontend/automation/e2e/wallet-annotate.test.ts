import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/commands/init-app'
import restoreWallet from '../support/commands/restore-wallet'
import { authenticate, unlockWallet } from '../support/helpers'

const passphrase = process.env.testWalletPassphrase as string
const walletName = process.env.testWalletName as string
const pubkey = process.env.testWalletPublicKey

test.describe('wallet annotate metadata', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await restoreWallet(page)
    await page.goto('/')
  })

  test('handles key name update', async () => {
    // 0001-WALL-055 must be able to change key name/alias
    const NEW_NAME = 'new name'
    await unlockWallet(page, walletName, passphrase)
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await page.getByTestId('keypair-update').click()
    await expect(page.getByTestId('metadata-key-0')).toContainText('Name')
    await expect(page.getByTestId('metadata-value-0')).toBeVisible()

    await page.getByTestId('metadata-value-0').type(NEW_NAME)
    await page.getByTestId('metadata-submit').click()
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'Successfully updated metadata'
    )
    await expect(page.getByTestId('header-title')).toHaveText(NEW_NAME)
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
