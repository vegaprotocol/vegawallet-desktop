import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import createWallet from '../pages/create-wallet'
import { createRandomWalletName } from '../pages/create-wallet'
import networkTab from '../pages/network-tab'
import viewWallet from '../pages/view-wallet'
import wallets from '../pages/wallets'
import cleanup from '../support/cleanup'
import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'

let page: Page
let networkTabPage: ReturnType<typeof networkTab>
let createWalletPage: ReturnType<typeof createWallet>
let viewWalletPage: ReturnType<typeof viewWallet>
let walletPage: ReturnType<typeof wallets>
const testPassphrase = '123'

test.describe('onboarding - mainnet version', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    walletPage = wallets(page)
    createWalletPage = createWallet(page)
    viewWalletPage = viewWallet(page)
    networkTabPage = networkTab(page)

    await initApp(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page, 'mainnet1')
  })

  test('import and start mainnet automatically', async () => {
    await expect(page.getByTestId('service-status')).toHaveText(
      'Wallet Service: mainnet1 on http://127.0.0.1:1789'
    )
  })

  test('create new wallet', async () => {
    const walletName = createRandomWalletName()

    await walletPage.goToCreateWalletPage()
    await createWalletPage.createWallet(walletName, testPassphrase)
    await createWalletPage.checkToastSuccess()
  })

  test('create multiple wallets - switch between them', async () => {
    // 0001-WALL-066 must be able to create multiple wallets
    // 0001-WALL-067 must be able to switch between wallets
    const walletName = createRandomWalletName()
    const walletName2 = createRandomWalletName()

    await walletPage.goToCreateWalletPage()
    await createWalletPage.createWallet(walletName, testPassphrase)
    await createWalletPage.checkToastSuccess()
    await createWalletPage.goToViewWalletPage()
    await viewWalletPage.checkWalletExists(walletName)

    await viewWalletPage.goToWalletsPage()
    await walletPage.goToCreateWalletPage()
    await createWalletPage.createWallet(walletName2, testPassphrase)
    await createWalletPage.goToViewWalletPage()
    await viewWalletPage.checkWalletExists(walletName2)

    await viewWalletPage.goToWalletsPage()
    await walletPage.openWalletAndAssertName(walletName)

    await viewWalletPage.goToWalletsPage()
    await walletPage.openWalletAndAssertName(walletName2)
  })

  test('mainnet should be selectable as default network when envvar is mainnet or empty', async () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    await networkTabPage.openNetworkTabAndViewNetworks()
    await networkTabPage.checkExpectedNetworksAvailable(['mainnet1'])
  })

  test('import wallet', async () => {
    const walletName = 'test'
    const recoveryPhrase = data.testWalletRecoveryPhrase
    await page.getByTestId('import-wallet').click()
    await page.getByTestId('wallet-import-form-name').type(walletName)
    await page
      .getByTestId('wallet-import-form-recovery-phrase')
      .type(recoveryPhrase)
    await page.getByTestId('version').selectOption(String(2))
    await page.getByTestId('wallet-import-form-passphrase').type(testPassphrase)
    await page
      .getByTestId('wallet-import-form-passphrase-confirm')
      .type(testPassphrase)
    await page.getByTestId('wallet-import-form-submit').click()
    await expect(page.getByTestId('toast')).toHaveText('Wallet imported')
  })

  test('import wallet validation', async () => {
    await page.getByTestId('import-wallet').click()
    await page.getByTestId('wallet-import-form-submit').click()
    await expect(page.getByTestId('helper-text')).toHaveCount(4)
  })

  test('import wallet with invalid recovery phrase', async () => {
    const walletName = 'test-invalid'
    const invalidRecoveryPhrase = 'invalid'
    await page.getByTestId('import-wallet').click()
    await page.getByTestId('wallet-import-form-name').type(walletName)
    await page
      .getByTestId('wallet-import-form-recovery-phrase')
      .type(invalidRecoveryPhrase)
    await page.getByTestId('version').selectOption(String(2))
    await page.getByTestId('wallet-import-form-passphrase').type(testPassphrase)
    await page
      .getByTestId('wallet-import-form-passphrase-confirm')
      .type(testPassphrase)
    await page.getByTestId('wallet-import-form-submit').click()
    await expect(page.getByTestId('toast')).toHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
