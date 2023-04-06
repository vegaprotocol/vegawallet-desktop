import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import { unlockWallet, waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'

const recoveryPhrase = data.testWalletRecoveryPhrase
const pubkey = data.testWalletPublicKey

test.describe('import wallet', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await restoreWallet(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
    await page.click('[data-testid="import-wallet"]')
  })

  test('recover wallet', async () => {
    // 0001-WALL-004
    await fillInRecoveryForm(page, 'import test', '123', recoveryPhrase)
    await expect(page.getByTestId('toast')).toHaveText('Wallet imported')

    // Can open newly imported wallet
    await unlockWallet(page, 'import-test', '123')
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await expect(page.getByTestId('public-key')).toContainText(pubkey)
  })

  test('recover wallet with same name', async () => {
    await fillInRecoveryForm(page, 'test', '123', recoveryPhrase)
    await expect(page.getByTestId('toast')).toHaveText(
      'Error: a wallet with the same name already exists'
    )
  })

  test('recover wallet with different version', async () => {
    await fillInRecoveryForm(page, 'newwallet', '123', recoveryPhrase, 1)
    await expect(page.getByTestId('toast')).toHaveText('Wallet imported')
  })

  test('form validation', async () => {
    await page.getByTestId('wallet-import-form-submit').click()
    await expect(page.getByTestId('helper-text')).toHaveCount(4)
  })

  test('incorrect recovery phrase', async () => {
    await fillInRecoveryForm(page, 'newallet', '123', 'incorrect')
    await expect(page.getByTestId('toast')).toHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
  })
  test.afterAll(async () => {
    await cleanup(page)
  })
})

async function fillInRecoveryForm(
  page: Page,
  walletName: string,
  passphrase: string,
  recoveryPhrase: string,
  version = 2
) {
  await page.getByTestId('wallet-import-form-name').type(walletName)
  await page
    .getByTestId('wallet-import-form-recovery-phrase')
    .type(recoveryPhrase)
  await page.getByTestId('version').selectOption(String(version))
  await page.getByTestId('wallet-import-form-passphrase').type(passphrase)
  await page
    .getByTestId('wallet-import-form-passphrase-confirm')
    .type(passphrase)
  await page.getByTestId('wallet-import-form-submit').click()
}
