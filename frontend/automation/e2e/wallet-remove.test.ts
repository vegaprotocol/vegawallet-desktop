import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import initApp from '../support/commands/init-app'
import restoreWallet from '../support/commands/restore-wallet'
import waitForNetworkConnected from '../support/commands/wait-for-network-connected'
import { unlockWallet } from '../support/helpers'

test.describe('wallet remove', () => {
  const passphrase = data.testWalletPassphrase
  const walletName = data.testWalletName

  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await restoreWallet(page)
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('removes a wallet', async () => {
    // 0001-WALL-068 must be able to remove a wallet
    await unlockWallet(page, walletName, passphrase)

    const form = page.getByTestId('remove-wallet-form')

    await page.getByTestId('remove-wallet').click()
    await form.locator('button[type="submit"]').click()
    await expect(page.getByTestId('helper-text')).toHaveText('Required')
    await form.locator('input').type('invalid text')
    await form.locator('button[type="submit"]').click()
    await expect(page.getByTestId('helper-text')).toHaveText(
      'Invalid confirmation text'
    )
    await form.locator('input').clear()
    await form.locator('input').type('remove wallet')
    await form.locator('button[type="submit"]').click()
    await expect(page.getByTestId('helper-text')).toHaveText(
      'Invalid confirmation text'
    )
    await form.locator('input').clear()
    await form.locator('input').type(`Remove ${walletName}`)
    await form.locator('button[type="submit"]').click()
    await expect(page.getByTestId('toast')).toHaveText('Wallet removed')
    await expect(page.getByTestId('wallet-home')).toBeVisible()
    await expect(page.getByTestId(`wallet-${walletName}`)).toBeHidden()
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
