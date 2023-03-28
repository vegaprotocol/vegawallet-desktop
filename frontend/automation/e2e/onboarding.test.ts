import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/commands/init-app'
import waitForNetworkConnected from '../support/commands/wait-for-network-connected'

let page: Page
test.describe('onboarding', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await waitForNetworkConnected(page)
  })
  test.beforeEach(async () => {
    await page.goto('/')
  })
  test('create new wallet', async () => {
    const randomNum = Math.floor(Math.random() * 101)
    const walletName = `Test ${randomNum.toString()}`
    const passphrase = '123'
    await page.getByTestId('create-new-wallet').click()
    await page.getByTestId('create-wallet-form-name').type(walletName)
    await page.getByTestId('create-wallet-form-passphrase').type(passphrase)
    await page
      .getByTestId('create-wallet-form-passphrase-confirm')
      .type(passphrase)
    await page.getByTestId('create-wallet-form-submit').click()
    await expect(page.getByTestId('toast')).toHaveText('Wallet created!')
  })

  test('create multiple wallets - switch between them', async () => {
    // 0001-WALL-066 must be able to create multiple wallets
    // 0001-WALL-067 must be able to switch between wallets
    const randomNum = Math.floor(Math.random() * 101)
    const randomNum2 = Math.floor(Math.random() * 101)
    const walletName = `Test ${randomNum.toString()}`
    const walletName2 = `Test ${randomNum2.toString()}`
    const passphrase = '123'

    // Create a new wallet
    await page.getByTestId('create-new-wallet').click()
    await page.getByTestId('create-wallet-form-name').type(walletName)
    await page.getByTestId('create-wallet-form-passphrase').type(passphrase)
    await page
      .getByTestId('create-wallet-form-passphrase-confirm')
      .type(passphrase)
    await page.getByTestId('create-wallet-form-submit').click()
    await expect(page.getByTestId('toast')).toHaveText('Wallet created!')
    await expect(page.getByTestId('toast')).toBeHidden()
    await page.getByTestId('create-wallet-success-cta').click()
    await expect(page.getByTestId('header-title')).toHaveText(walletName)

    // Create another new wallet
    await page.getByTestId('back').click()
    await page.getByTestId('create-new-wallet').click()
    await page.getByTestId('create-wallet-form-name').type(walletName2)
    await page.getByTestId('create-wallet-form-passphrase').type(passphrase)
    await page
      .getByTestId('create-wallet-form-passphrase-confirm')
      .type(passphrase)
    await page.getByTestId('create-wallet-form-submit').click()
    await expect(page.getByTestId('toast')).toHaveText('Wallet created!')
    await expect(page.getByTestId('toast')).toBeHidden()
    await page.getByTestId('create-wallet-success-cta').click()
    await expect(page.getByTestId('header-title')).toHaveText(walletName2)

    // Switch back to first wallet
    await page.getByTestId('back').click()
    await page.getByTestId(`wallet-${walletName.replace(' ', '-')}`).click()
    await expect(page.getByTestId('header-title')).toHaveText(walletName)

    // Back out and access wallet2
    await page.getByTestId('back').click()
    await page.getByTestId(`wallet-${walletName2.replace(' ', '-')}`).click()
    await expect(page.getByTestId('header-title')).toHaveText(walletName2)
  })

  test('import default wallets', async () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    await page.getByTestId('network-drawer').click()
    await page.getByTestId('network-select').click()
    const options = await page.getByRole('menuitem').allInnerTexts()
    expect(options).toContain('mainnet1')
    expect(options).toContain('testnet2')
    expect(options).toContain('fairground')
  })

  test('import wallet', async () => {
    const walletName = 'test'
    const passphrase = '123'
    const recoveryPhrase = process.env.testWalletRecoveryPhrase as string
    await page.getByTestId('import-wallet').click()
    await page.getByTestId('wallet-import-form-name').type(walletName)
    await page
      .getByTestId('wallet-import-form-recovery-phrase')
      .type(recoveryPhrase)
    await page.getByTestId('version').selectOption(String(2))
    await page.getByTestId('wallet-import-form-passphrase').type(passphrase)
    await page
      .getByTestId('wallet-import-form-passphrase-confirm')
      .type(passphrase)
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
    const passphrase = '123'
    const invalidRecoveryPhrase = 'invalid'
    await page.getByTestId('import-wallet').click()
    await page.getByTestId('wallet-import-form-name').type(walletName)
    await page
      .getByTestId('wallet-import-form-recovery-phrase')
      .type(invalidRecoveryPhrase)
    await page.getByTestId('version').selectOption(String(2))
    await page.getByTestId('wallet-import-form-passphrase').type(passphrase)
    await page
      .getByTestId('wallet-import-form-passphrase-confirm')
      .type(passphrase)
    await page.getByTestId('wallet-import-form-submit').click()
    await expect(page.getByTestId('toast')).toHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
