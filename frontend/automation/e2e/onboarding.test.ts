import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import {
  isMainnetConfiguration,
  waitForNetworkConnected
} from '../support/helpers'
import initApp from '../support/init-app'
import { CreateWallet } from '../support/pages/create-wallet'
import { ViewWallet } from '../support/pages/view-wallet'
import { Wallets } from '../support/pages/wallets'

let page: Page
let createWalletPage: CreateWallet
let viewWalletPage: ViewWallet
let walletPage: Wallets
const testPassphrase = '123'

test.describe('onboarding', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    walletPage = new Wallets(page)
    createWalletPage = new CreateWallet(page)
    viewWalletPage = new ViewWallet(page)
    await initApp(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('create new wallet', async () => {
    const walletName = await createWalletPage.createRandomWalletName()

    await walletPage.goToCreateWalletPage()
    await createWalletPage.createWallet(walletName, testPassphrase)
    await createWalletPage.checkToastSuccess()
  })

  test('create multiple wallets - switch between them', async () => {
    // 0001-WALL-066 must be able to create multiple wallets
    // 0001-WALL-067 must be able to switch between wallets
    const walletName = await createWalletPage.createRandomWalletName()
    const walletName2 = await createWalletPage.createRandomWalletName()

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
