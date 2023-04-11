import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import wallets from '../pages/wallets'
import cleanup from '../support/cleanup'
import { authenticate, waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'
const passphrase = data.testWalletPassphrase
const walletName = data.testWalletName
const pubkey = data.testWalletPublicKey
let walletPage: ReturnType<typeof wallets>

test.describe('wallet annotate metadata', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    walletPage = wallets(page)
    await initApp(page)
    await restoreWallet(page)
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('handles key name update', async () => {
    // 0001-WALL-055 must be able to change key name/alias
    const NEW_NAME = 'new name'
    const openedWalletName = await walletPage.openWalletAndGetName(
      walletName,
      passphrase
    )
    expect(openedWalletName).toBe(walletName)
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
