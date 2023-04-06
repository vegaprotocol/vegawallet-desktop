import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import wallets from '../pages/wallets'
import cleanup from '../support/cleanup'
import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'

const passphrase = data.testWalletPassphrase
const walletName = data.testWalletName
let walletPage: ReturnType<typeof wallets>
const newWalletName = `${Math.random().toString(36).substring(2)}`

test.describe('wallet edit', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    walletPage = wallets(page)
    await initApp(page)
    await restoreWallet(page)
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('edits wallet name', async () => {
    //0001-WALL-069 must be able to change wallet name
    await walletPage.openWalletAndAssertName(walletName, passphrase)
    await page.getByTestId('edit-wallet').click()
    await expect(page.getByTestId('edit-wallet-form')).toBeVisible()
    const walletForm = page.getByTestId('edit-wallet-form')
    await expect(walletForm).toBeVisible()
    await walletForm.locator('input').clear()
    await walletForm.locator('input').type(newWalletName)
    await walletForm.locator('button[type="submit"]').click()
    await expect(page.getByTestId('edit-wallet-form')).toBeHidden()
    await expect(page.getByTestId('header-title')).toHaveText(newWalletName)
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
