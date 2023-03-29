import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import {
  authenticate,
  unlockWallet,
  waitForNetworkConnected
} from '../support/helpers'
import initApp from '../support/init-app'
import { restoreWallet } from '../support/wallet-api'

const passphrase = data.testWalletPassphrase
const walletName = data.testWalletName
const pubkey = data.testWalletPublicKey

test.describe('wallet sign key', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await restoreWallet(page)
  })

  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
    await unlockWallet(page, walletName, passphrase)
    await page.getByTestId(`wallet-keypair-${pubkey}`).click()
    await page.getByTestId('keypair-sign').click()
  })

  test('message signing - success', async () => {
    await signMessage(page, 'Sign message successfully')
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'Message signed successfully'
    )
  })

  test('message signing - able to sign multiple', async () => {
    await signMessage(page, 'Sign message successfully')
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'Message signed successfully'
    )
    await page.getByTestId('toast').waitFor({ state: 'hidden' })
    await page.getByTestId('sign-more').click()
    await signMessage(page, 'Sign message successfully')
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'Message signed successfully'
    )
  })

  test('message signing - prompt for content', async () => {
    // 0001-WALL-059 must be prompted to enter content to sign
    await page.getByTestId('sign').click()
    await expect(page.getByTestId('helper-text')).toHaveText('Required')
    await signMessage(page, 'Sign message successfully')
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'Message signed successfully'
    )
  })

  test('message signing - hashed of signed content given', async () => {
    // 0001-WALL-065 must be able to submit/sign the content and am
    // given a hash of the signed content as well as the message (now encoded)
    await signMessage(page, 'I am a secret')
    await authenticate(page, passphrase)
    await expect(page.getByTestId('toast')).toContainText(
      'Message signed successfully'
    )
    const message = (await page
      .getByTestId('keypair-sign')
      .locator('[data-state="closed"]')
      .textContent()) as string
    expect(message.length).toEqual(88)

    await expect(page.locator('body')).not.toContainText('I am a secret')
  })

  test('message signing - failure', async () => {
    await page.getByTestId('sign').click()
    await signMessage(page, 'Sign message failure')
    await authenticate(page, 'invalid')
    await expect(page.getByTestId('toast')).toContainText(
      'Error: wrong passphrase'
    )
  })
  test.afterAll(async () => {
    await cleanup(page)
  })
})

async function signMessage(page: Page, message: string): Promise<void> {
  await page.getByTestId('message-field').type(message)
  await page.getByTestId('sign').click()
}
