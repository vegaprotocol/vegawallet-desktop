import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/commands/init-app'
import waitForNetworkConnected from '../support/commands/wait-for-network-connected'

test.describe('wallet service', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('imports and starts mainnet automatically', async () => {
    await expect(page.getByTestId('service-status')).toHaveText(
      'Wallet Service: mainnet2 on http://127.0.0.1:1789'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
