import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import { isMainnetConfiguration, waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { Pages } from '../support/pages/Pages'

let page: Page
let pages: Pages
const testPassphrase = '123'

test.describe('onboarding', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    pages = new Pages(page)
    await initApp(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('create new wallet', async () => {
    const walletName = await pages.createWalletPage.createRandomWalletName()

    await pages.walletPage.goToCreateWalletPage()
    await pages.createWalletPage.createWallet(walletName, testPassphrase)
    await pages.createWalletPage.checkToastSuccess()
  })

  test('create multiple wallets - switch between them', async () => {
    // 0001-WALL-066 must be able to create multiple wallets
    // 0001-WALL-067 must be able to switch between wallets
    const walletName = await pages.createWalletPage.createRandomWalletName()
    const walletName2 = await pages.createWalletPage.createRandomWalletName()

    await pages.walletPage.goToCreateWalletPage()
    await pages.createWalletPage.createWallet(walletName, testPassphrase)
    await pages.createWalletPage.checkToastSuccess()
    await pages.createWalletPage.goToViewWalletPage()
    await pages.viewWalletPage.checkWalletExists(walletName)

    await pages.viewWalletPage.goToWalletsPage()
    await pages.walletPage.goToCreateWalletPage()
    await pages.createWalletPage.createWallet(walletName2, testPassphrase)
    await pages.createWalletPage.goToViewWalletPage()
    await pages.viewWalletPage.checkWalletExists(walletName2)

    await pages.viewWalletPage.goToWalletsPage()
    await pages.walletPage.openWalletAndAssertName(walletName)

    await pages.viewWalletPage.goToWalletsPage()
    await pages.walletPage.openWalletAndAssertName(walletName2)
  })

  test('mainnet should be selctable as deafult network when envvar is mainnet or empty', async () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    if (await isMainnetConfiguration()) {
      await page.getByTestId('network-drawer').click()
      await page.getByTestId('network-select').click()
      const options = await page.getByRole('menuitem').allInnerTexts()
      expect(options).toContain('mainnet1')
    } else {
      test.skip()
    }
  })

  test('import wallet', async () => {
    const walletName = 'test'
    const recoveryPhrase = data.testWalletRecoveryPhrase
    await pages.walletPage.goToImportWalletPage()
    await pages.importWalletPage.importWallet(walletName, testPassphrase, recoveryPhrase)
    await pages.importWalletPage.checkToastSuccess()
  })

  test('import wallet validation', async () => {
    await pages.walletPage.goToImportWalletPage()
    await pages.importWalletPage.importWallet('', '', '')
    await pages.importWalletPage.checkRequiredMessageAppears(4)
  })

  test('import wallet with invalid recovery phrase', async () => {
    const walletName = 'test-invalid'
    const invalidRecoveryPhrase = 'invalid'
    await pages.walletPage.goToImportWalletPage()
    await pages.importWalletPage.importWallet(walletName, invalidRecoveryPhrase, testPassphrase)
    await pages.importWalletPage.checkToastShowsError()
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
