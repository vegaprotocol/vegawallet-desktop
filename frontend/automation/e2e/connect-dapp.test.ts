import type { APIRequestContext, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreNetwork, restoreWallet } from '../support/wallet-api'

// Request context is reused by all tests in the file.
let apiContext: APIRequestContext
let page: Page

test.beforeAll(async ({ playwright, browser }) => {
  apiContext = await playwright.request.newContext({
    // All requests we send go to this API endpoint.
    baseURL: 'http://localhost:1789/api/v2/requests',
    extraHTTPHeaders: {
      Origin: 'https://console.fairground.wtf',
      'Content-Type': 'application/json'
    }
  })
  page = await browser.newPage()
  await initApp(page)
  await restoreWallet(page)
  await restoreNetwork(page)
  await page.goto('/')
  await waitForNetworkConnected(page)
})

test.afterAll(async ({}) => {
  await page.close()
  // Dispose all responses.
  await apiContext.dispose()
})

test('should show dapp connect modal', async () => {
  apiContext
    .post('', {
      data: {
        jsonrpc: '2.0',
        id: '1',
        method: 'client.connect_wallet',
        params: { hostname: 'console.fairground.wtf' }
      }
    })
    .catch(() => {} /* ignore error */)
  await expect(page.getByTestId('dapp-connect-modal')).toBeVisible()
})
