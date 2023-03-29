import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/init-app'
test.describe('wallet service', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await page.goto('/')
  })

  test('imports and starts mainnet automatically', async () => {
    await expect(page.getByTestId('service-status')).toHaveText(
      'Wallet Service: mainnet1 on http://127.0.0.1:1789',
      { timeout: 20 * 1000 }
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
