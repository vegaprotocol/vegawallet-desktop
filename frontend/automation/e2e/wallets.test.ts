import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import pages from '../pages/pages'
import cleanup from '../support/cleanup'
import {
  authenticate,
  getTextFromClipboard,
  waitForNetworkConnected
} from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'
import exp from 'constants'

const passphrase = data.testWalletPassphrase
const walletName = data.testWalletName
const pubkey = data.testWalletPublicKey
let pgObjects: ReturnType<typeof pages>

test.describe('wallet sign key', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    pgObjects = pages(page)
    await initApp(page)
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('create wallet', async () => {
    // 0001-WALL-005
    // 0001-WALL-006
    // 0001-WALL-008
    await pgObjects.walletPage.goToCreateWalletPage()
    await pgObjects.createWalletPage.createWallet(walletName, passphrase)
    await pgObjects.createWalletPage.checkToastSuccess()
    await expect(page.getByTestId('recovery-phrase-warning')).not.toBeEmpty()
    await expect(page.locator('code.block').first()).toContainText('2')
    const recovery = (await page
      .getByTestId('recovery-phrase')
      .textContent()) as string
    expect(recovery.split(' ').length).toEqual(24)

    await pgObjects.createWalletPage.goToViewWalletPage()
    await pgObjects.viewWalletPage.checkWalletExists(walletName)
    await expect(
      page.getByTestId('wallet-keypair').getByRole('button')
    ).toContainText('Key 1')
    await expect(
      page.getByTestId('wallet-keypair').locator('[data-state="closed"]')
    ).toContainText(/\w{6}.\w{4}$/)

    await page.getByTestId('wallet-keypair').getByRole('button').click()
    await expect(page.getByTestId('public-key')).toHaveText(/\w{64}$/)
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})

test.describe('wallet', async () => {
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
    const openedWalletName = await pgObjects.walletPage.openWalletAndGetName(
      walletName,
      passphrase
    )
    expect(openedWalletName).toEqual(walletName)
  })

  test('view wallet keypairs', async () => {
    await expect(page.getByTestId('passphrase-form')).toBeHidden()
    await expect(page.getByTestId('generate-keypair')).toBeVisible()
    await expect(page.getByTestId('remove-wallet')).toBeVisible()
    await expect(page.getByTestId(`wallet-keypair-${pubkey}`)).toBeVisible()
  })

  test('wrong passphrase', async () => {
    await page.goto('')
    await pgObjects.walletPage.openWallet(walletName, 'invalid')
    await expect(page.getByTestId('toast')).toHaveText(
      'Error: wrong passphrase'
    )
  })

  test('generate new key pair', async () => {
    // 0001-WALL-052 must be able to create new keys (derived from the source of wallet)
    await expect(page.getByTestId('wallet-keypair')).toHaveCount(1)
    await page.getByTestId('generate-keypair').click()
    await authenticate(page, passphrase)
    await expect(page.getByTestId('wallet-keypair')).toHaveCount(2)
  })

  test('copy public key from keylist', async () => {
    // 0001-WALL-054 must see full public key or be able to copy it to clipboard
    const copyButton = '[data-state="closed"] > svg'
    await page.getByTestId('wallet-keypair').locator(copyButton).first().click()
    const clipboard = await getTextFromClipboard(page)
    expect(clipboard).toMatch(/\w{64}$/)
  })

  test('copy public key from key details', async () => {
    // 0001-WALL-054 must see full public key or be able to copy it to clipboard
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await page.getByTestId('public-key').click()
    const clipboard = await getTextFromClipboard(page)
    expect(clipboard).toMatch(/\w{64}$/)
  })

  test('key pair page', async () => {
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await expect(page.getByTestId('header-title')).toHaveText('Key 1')
    await expect(page.getByTestId('public-key')).toHaveText(/\w{64}$/)
  })

  test('wallet stays logged in', async () => {
    // 0001-WALL-016 must select a wallet and enter the passphrase only once per "session"
    await page.getByTestId('back').click()
    await page.getByTestId(`wallet-${walletName}`).click()
    await expect(page.getByTestId('passphrase-form')).toBeHidden()
    await expect(page.getByTestId('header-title')).toHaveText(walletName)
  })

  test('can navigate to transactions page', async () => {
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await page.getByTestId('keypair-transactions').click()
    await expect(page.getByTestId('header-title')).toHaveText('Transactions')
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
