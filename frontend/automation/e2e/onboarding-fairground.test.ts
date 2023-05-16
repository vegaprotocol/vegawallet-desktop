import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import createWallet from '../pages/create-wallet'
import { createRandomWalletName } from '../pages/create-wallet'
import viewWallet from '../pages/view-wallet'
import wallets from '../pages/wallets'

// IMPORTANT! This test is designed to be run on Fairground version of the wallet which was freshly created in CI.
// In order to run it locally, make sure that config.fairground.toml file does NOT exist in wallet-app configuration directory.
// E.g. for MacOS it is ~/Library/Application Support/vega/wallet-app/
test.describe('onboarding - fairground version', () => {
  test.describe.configure({ mode: 'serial' })

  // in this scenario following steps are related to each other and should be executed in the same order
  // they reflect the user flow when they open the app (fairground version) for the first time

  let page: Page
  let createWalletPage: ReturnType<typeof createWallet>
  let walletPage: ReturnType<typeof wallets>
  let viewWalletPage: ReturnType<typeof viewWallet>

  const walletName = createRandomWalletName()

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')

    // There is a bug in app, that shows this error toast, need to be removed after fix
    await page.getByTestId('close').click()

    walletPage = wallets(page)
    createWalletPage = createWallet(page)
    viewWalletPage = viewWallet(page)
  })

  test('VegaHome pop-up validation', async () => {
    await expect(page.getByTestId('splash-loader')).toBeHidden()
    await expect(page.getByTestId('onboard-home')).toBeVisible()
    await expect(page.getByTestId('onboard-home')).toContainText(
      'Looks like you are using a Fairground build of the wallet. We recommended that you use a different VegaHome directory as compatibility between versions is not yet guaranteed.'
    )
    await expect(page.locator('#vega-home')).toBeVisible()
  })

  test('VegaHome setup', async () => {
    await page.fill('#vega-home', data.vegaHome)
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByTestId('onboard-home')).toBeHidden()
    await expect(page.getByTestId('create-new-wallet')).toBeVisible()
    await expect(page.getByTestId('import-wallet')).toBeVisible()
  })

  test('Create new wallet', async () => {
    await walletPage.goToCreateWalletPage()
    await createWalletPage.createWallet(walletName, data.testWalletPassphrase)
    await createWalletPage.checkToastSuccess()
  })

  test('View wallet', async () => {
    await page.getByTestId('create-wallet-success-cta').click()
    await viewWalletPage.checkWalletExists(walletName)
  })

  test('View wallet list', async () => {
    await viewWalletPage.goToWalletsPage()
    await expect(
      page.getByTestId(`wallet-${walletName.replaceAll(' ', '-')}`)
    ).toContainText(walletName)
  })

  test('Check default network to be fairground', async () => {
    // 0001-WALL-009 - must have Mainnet and Fairground (testnet) pre-configured (with Mainnet being the default network)
    await expect(page.getByTestId('service-status')).toContainText(
      'Wallet Service: fairground'
    )
  })
})
