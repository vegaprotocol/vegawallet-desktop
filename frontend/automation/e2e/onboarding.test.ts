import { Page, expect } from '@playwright/test'
import { test } from '@playwright/test'

import data from '../data/test-data.json'
import pages from '../pages/pages'
import cleanup from '../support/cleanup'
import {
  isMainnetConfiguration,
  waitForNetworkConnected
} from '../support/helpers'
import initApp from '../support/init-app'

let page: Page
let pgObjects: ReturnType<typeof pages>
const testPassphrase = '123'

test.describe('onboarding', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    pgObjects = pages(page)
    await initApp(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('create new wallet', async () => {
    const walletName = await pgObjects.createWalletPage.createRandomWalletName()

    await pgObjects.walletPage.goToCreateWalletPage()
    await pgObjects.createWalletPage.createWallet(walletName, testPassphrase)
    await pgObjects.createWalletPage.checkToastSuccess()
  })

  test('create multiple wallets - switch between them', async () => {
    // 0001-WALL-066 must be able to create multiple wallets
    // 0001-WALL-067 must be able to switch between wallets
    const walletName = await pgObjects.createWalletPage.createRandomWalletName()
    const walletName2 =
      await pgObjects.createWalletPage.createRandomWalletName()

    await pgObjects.walletPage.goToCreateWalletPage()
    await pgObjects.createWalletPage.createWallet(walletName, testPassphrase)
    await pgObjects.createWalletPage.checkToastSuccess()
    await pgObjects.createWalletPage.goToViewWalletPage()
    await pgObjects.viewWalletPage.checkWalletExists(walletName)

    await pgObjects.viewWalletPage.goToWalletsPage()
    await pgObjects.walletPage.goToCreateWalletPage()
    await pgObjects.createWalletPage.createWallet(walletName2, testPassphrase)
    await pgObjects.createWalletPage.goToViewWalletPage()
    await pgObjects.viewWalletPage.checkWalletExists(walletName2)

    await pgObjects.viewWalletPage.goToWalletsPage()
    let openedWalletName = await pgObjects.walletPage.openWalletAndGetName(
      walletName
    )
    expect(openedWalletName).toBe(walletName)

    await pgObjects.viewWalletPage.goToWalletsPage()
    openedWalletName = await pgObjects.walletPage.openWalletAndGetName(
      walletName2
    )
    expect(openedWalletName).toBe(walletName2)
  })

  test('mainnet should be selectable as default network when envvar is mainnet or empty', async () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!isMainnetConfiguration())

    await pgObjects.network.openNetworkTabAndViewNetworks()
    await pgObjects.network.checkExpectedNetworksAvailable(['mainnet1'])
  })

  test('fairground should be selectable as default network when envvar is fairground', async () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(isMainnetConfiguration())

    await pgObjects.network.openNetworkTabAndViewNetworks()
    await pgObjects.network.checkExpectedNetworksAvailable(['fairground'])
  })

  test('import wallet', async () => {
    const walletName = 'test'
    const recoveryPhrase = data.testWalletRecoveryPhrase
    await pgObjects.walletPage.goToImportWalletPage()
    await pgObjects.importWalletPage.importWallet(
      walletName,
      testPassphrase,
      recoveryPhrase
    )
    await expect(pgObjects.importWalletPage.toast).toHaveText('Wallet imported')
  })

  test('import wallet validation', async () => {
    await pgObjects.walletPage.goToImportWalletPage()
    await pgObjects.importWalletPage.importWallet('', '', '')
    await expect(pgObjects.importWalletPage.userInputRequiredText).toHaveCount(
      4
    )
  })

  test('import wallet with invalid recovery phrase', async () => {
    const walletName = 'test-invalid'
    const invalidRecoveryPhrase = 'invalid'
    await pgObjects.walletPage.goToImportWalletPage()
    await pgObjects.importWalletPage.importWallet(
      walletName,
      invalidRecoveryPhrase,
      testPassphrase
    )
    await expect(pgObjects.importWalletPage.toast).toHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
