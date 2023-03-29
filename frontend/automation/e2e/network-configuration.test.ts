import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { restoreNetwork } from '../support/wallet-api'

let page: Page
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await initApp(page)
  await restoreNetwork(page)
  await restoreNetwork(page, 'test_network2')
  await restoreNetwork(page, 'test_network3')
})

test.beforeEach(async () => {
  await page.goto('/')
  await waitForNetworkConnected(page)
  await page.getByTestId('network-drawer').click()
})

test.describe('manage networks', async () => {
  test('change network and persists after reload', async () => {
    await waitForNetworkConnected(page)
    await page.getByTestId('network-select').click()
    await page.getByTestId('select-test_network2').click()
    await expect(page.getByTestId('service-status')).toContainText(
      'Wallet Service: test_network2 on http://127.0.0.1:1789',
      { timeout: 20 * 1000 }
    )
    await page.reload()
    await expect(page.getByTestId('service-status')).toContainText(
      'Wallet Service: test_network2 on http://127.0.0.1:1789',
      { timeout: 20 * 1000 }
    )
    await page.getByTestId('network-drawer').click()
    await page.getByTestId('network-select').click()
    await page.getByTestId('select-test').click()
    await expect(page.getByTestId('service-status')).toContainText(
      'Wallet Service: test',
      { timeout: 20 * 1000 }
    )
  })

  test('view network details', async () => {
    await expect(page.getByTestId('network-select')).not.toBeEmpty()
    const nodes = page.getByTestId('nodes-list')
    for (let i = 0; i < (await nodes.count()); i++) {
      await expect(nodes.nth(i)).not.toBeEmpty()
    }
  })

  test('edit network details displayed', async () => {
    await editNetwork(page, 'test')
    const nodes = page.locator('form').getByTestId('nodes-list')
    for (let i = 0; i < (await nodes.count()); i++) {
      await expect(nodes.nth(i)).not.toBeEmpty()
    }
  })

  test('remove network', async () => {
    // 0001-WALL-013
    await page.getByTestId('manage-networks').click()
    await page.getByTestId('remove-network-test_network2').click()
    await expect(page.getByTestId('toast')).toContainText(
      'Successfully removed network'
    )
  })
  test.afterAll(async () => {
    await cleanup(page)
  })
})

// tests skipped until bug resolved https://github.com/vegaprotocol/vegawallet-desktop/issues/588
test.describe.fixme('change network details', () => {
  // 0001-WALL-011
  test.beforeEach(async () => {
    await editNetwork(page, 'test_network3')
  })

  test('able to change service console url', async () => {
    const newURL = 'http://console.url'
    await page.getByTestId('network-console-url').clear()
    await page.getByTestId('network-console-url').type(newURL)
    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.getByTestId('network-console-url')).toHaveValue(newURL)
  })

  test('able to change service explorer url', async () => {
    const newURL = 'http://explorer.url'
    await page.getByTestId('network-explorer-url').clear()
    await page.getByTestId('network-explorer-url').type(newURL)
    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.getByTestId('network-explorer-url')).toHaveValue(newURL)
  })

  test('able to change service governance url', async () => {
    const newURL = 'http://governance.url'
    await page.getByTestId('network-token-url').clear()
    await page.getByTestId('network-token-url').type(newURL)
    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.getByTestId('network-token-url')).toHaveValue(newURL)
  })

  test('able to change gRPC nodes', async () => {
    await expect(page.locator('[name*="grpcHosts"]')).toHaveCount(7) // wait until list has loaded
    await expect(page.locator('[name*="grpcHosts"]').first()).toBeVisible()
    const oldValue = (await page
      .locator('[name*="grpcHosts"]')
      .first()
      .textContent()) as string
    await page
      .locator('[name*="grpcHosts"] + [data-testid="remove"]')
      .first()
      .click()
    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.locator('[name*="grpcHosts"]')).toHaveCount(6)
    await expect(page.locator('[name*="grpcHosts"]')).not.toContainText(
      oldValue
    )
  })

  test('able to change GraphQL nodes', async () => {
    const newGraphQlUrl = 'https://mochachoca.vega.xyz/query'
    await page.getByTestId('add').nth(1).click()
    await page.locator('[name*="graphqlHosts"]').type(newGraphQlUrl)
    await page
      .locator('[name*="grpcHosts"] + [data-testid="remove"]')
      .first()
      .click()

    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.locator('[name*="graphqlHosts"]')).toHaveCount(1)
    await expect(page.locator('[name*="graphqlHosts"]')).toContainText(
      newGraphQlUrl
    )
  })

  test('able to add a new REST node', async () => {
    const newRestUrl = 'https://rest.nodes.vega.xyz/query'
    await page.getByTestId('add').nth(2).click()
    await page.locator('[name*="restHosts"]').type(newRestUrl)
    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.locator('[name*="restHosts"]')).toHaveCount(1)
    await expect(page.locator('[name*="restHosts"]')).toContainText(newRestUrl)
  })

  test('able to change gRPC Node retries', async () => {
    const newRetryAmount = '1'
    await page.getByTestId('node-retries').clear()
    await page.getByTestId('node-retries').type(newRetryAmount)
    await submitNetwork(page)
    await editNetwork(page, 'test_network3')
    await expect(page.getByTestId('node-retries')).toHaveValue(newRetryAmount)
  })
  test.afterAll(async () => {
    await cleanup(page)
  })
})

async function submitNetwork(page: Page) {
  await page.getByTestId('submit').click()
  await expect(page.getByTestId('toast')).toBeVisible()
  await expect(page.getByTestId('toast')).toContainText('Configuration saved')
}

async function editNetwork(page: Page, network: string) {
  await page.getByTestId('network-drawer').click()
  await page.getByTestId('network-drawer').click()
  await page.getByTestId('manage-networks').click()
  await page.getByTestId(`edit-network-${network}`).first().click()
}
