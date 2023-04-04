import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { Pages } from '../support/pages/Pages'
import { restoreWallet } from '../support/wallet-api'

const recoveryPhrase = data.testWalletRecoveryPhrase
const pubkey = data.testWalletPublicKey
const passphrase = '123'
let pages: Pages

test.describe('import wallet', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    pages = new Pages(page)
    await initApp(page)
    await restoreWallet(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
    await pages.walletPage.goToImportWalletPage()
  })

  test('recover wallet', async () => {
    // 0001-WALL-004
    await pages.importWalletPage.importWallet(
      'import test',
      passphrase,
      recoveryPhrase
    )
    await pages.importWalletPage.checkToastSuccess()

    // Can open newly imported wallet
    await pages.walletPage.openWalletAndAssertName('import test', passphrase)
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await expect(page.getByTestId('public-key')).toContainText(pubkey)
  })

  test('recover wallet with same name', async () => {
    await pages.importWalletPage.importWallet(
      'test',
      passphrase,
      recoveryPhrase
    )
    await pages.importWalletPage.expectToastToHaveText(
      'Error: a wallet with the same name already exists'
    )
  })

  test('recover wallet with different version', async () => {
    await pages.importWalletPage.importWallet(
      'newwallet',
      passphrase,
      recoveryPhrase,
      1
    )
    await pages.importWalletPage.expectToastToHaveText('Wallet imported')
  })

  test('form validation', async () => {
    await pages.importWalletPage.importWallet('', '', '')
    await pages.importWalletPage.checkRequiredMessageAppears(4)
  })

  test('incorrect recovery phrase', async () => {
    await pages.importWalletPage.importWallet(
      'newallet',
      passphrase,
      'incorrect'
    )
    await pages.importWalletPage.expectToastToHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
