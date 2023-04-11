import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import pages from '../pages/pages'
import cleanup from '../support/cleanup'
import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'

const recoveryPhrase = data.testWalletRecoveryPhrase
const pubkey = data.testWalletPublicKey
const passphrase = '123'
let pgObjects: ReturnType<typeof pages>

test.describe('import wallet', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    pgObjects = pages(page)
    await initApp(page)
    await restoreWallet(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
    await pgObjects.walletPage.goToImportWalletPage()
  })

  test('recover wallet', async () => {
    // 0001-WALL-004
    await pgObjects.importWalletPage.importWallet(
      'import test',
      passphrase,
      recoveryPhrase
    )
    await expect(pgObjects.importWalletPage.toast).toHaveText('Wallet imported')

    // Can open newly imported wallet
    const openedWalletName = await pgObjects.walletPage.openWalletAndGetName(
      'import test',
      passphrase
    )
    expect(openedWalletName).toBe('import test')
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await expect(page.getByTestId('public-key')).toContainText(pubkey)
  })

  test('recover wallet with same name', async () => {
    await pgObjects.importWalletPage.importWallet(
      'test',
      passphrase,
      recoveryPhrase
    )
    await expect(pgObjects.importWalletPage.toast).toHaveText(
      'Error: a wallet with the same name already exists'
    )
  })

  test('recover wallet with different version', async () => {
    await pgObjects.importWalletPage.importWallet(
      'newwallet',
      passphrase,
      recoveryPhrase,
      1
    )
    await expect(pgObjects.importWalletPage.toast).toHaveText('Wallet imported')
  })

  test('form validation', async () => {
    await pgObjects.importWalletPage.importWallet('', '', '')
    await expect(pgObjects.importWalletPage.userInputRequiredText).toHaveCount(
      4
    )
  })

  test('incorrect recovery phrase', async () => {
    await pgObjects.importWalletPage.importWallet(
      'newallet',
      passphrase,
      'incorrect'
    )
    await expect(pgObjects.importWalletPage.toast).toHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
