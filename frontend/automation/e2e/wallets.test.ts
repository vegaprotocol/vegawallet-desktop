import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import createWallet from '../pages/create-wallet'
import viewWallet from '../pages/view-wallet'
import wallets from '../pages/wallets'
import cleanup from '../support/cleanup'
import { getTextFromClipboard, unlockWallet } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'

const passphrase = data.testWalletPassphrase
const walletName = data.testWalletName
const pubkey = data.testWalletPublicKey
let createWalletPage: ReturnType<typeof createWallet>
let viewWalletPage: ReturnType<typeof viewWallet>
let walletPage: ReturnType<typeof wallets>

test.describe('create wallet', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    walletPage = wallets(page)
    createWalletPage = createWallet(page)
    viewWalletPage = viewWallet(page)
    await initApp(page)
    await page.goto('/')
  })

  test('create new wallet', async () => {
    // 0001-WALL-005
    // 0001-WALL-006
    // 0001-WALL-008
    await walletPage.goToCreateWalletPage()
    await createWalletPage.createWallet(walletName, passphrase)
    await createWalletPage.checkToastSuccess()
    await expect(page.getByTestId('recovery-phrase-warning')).not.toBeEmpty()
    await expect(page.locator('code.block').first()).toContainText('2')
    const recovery = (await page
      .getByTestId('recovery-phrase')
      .textContent()) as string
    expect(recovery.split(' ').length).toEqual(24)

    await page.getByTestId('create-wallet-success-cta').click()
    await viewWalletPage.checkWalletExists(walletName)
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
    await initApp(page)
    await restoreWallet(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await unlockWallet(page, walletName, passphrase)
  })

  test('view wallet keypairs', async () => {
    await expect(page.getByTestId('passphrase-form')).toBeHidden()
    await expect(page.getByTestId('generate-keypair')).toBeVisible()
    await expect(page.getByTestId('remove-wallet')).toBeVisible()
    await expect(page.getByTestId(`wallet-keypair-${pubkey}`)).toBeVisible()
  })

  test('wrong passphrase', async () => {
    await page.goto('')
    await unlockWallet(page, walletName, 'invalid')
    await expect(page.getByTestId('toast')).toHaveText(
      'Error: wrong passphrase'
    )
  })

  test('generate new key pair', async () => {
    // 0001-WALL-052 must be able to create new keys (derived from the source of wallet)
    await expect(page.getByTestId('wallet-keypair')).toHaveCount(1)
    await page.getByTestId('generate-keypair').click()
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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Key 1')
    await expect(page.getByTestId('public-key')).toHaveText(/\w{64}$/)
  })

  test('wallet stays logged in', async () => {
    // 0001-WALL-016 must select a wallet and enter the passphrase only once per "session"
    await page.getByTestId('page-back').click()
    await page.getByTestId(`wallet-${walletName}`).click()
    await expect(page.getByTestId('passphrase-form')).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(walletName)
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
