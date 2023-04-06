import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { join } from 'path'

import data from '../data/test-data.json'
import cleanup from '../support/cleanup'
import { waitForNetworkConnected } from '../support/helpers'
import initApp from '../support/init-app'
import { removeNetwork } from '../support/wallet-api'

const url = data.mainnetConfigUrl

test.describe('Import network', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await removeNetwork(page, 'fairground')
  })
  test.beforeEach(async () => {
    await page.goto('/')
    await waitForNetworkConnected(page)
    await page.getByTestId('network-drawer').click()
    await page.getByTestId('manage-networks').click()
    await page.getByTestId('add-network').click()
    await page.getByTestId('url-path').clear()
  })
  test('import successfully using url', async () => {
    const url = data.testnetConfigUrl
    expect(true).toBe(true)
    await page.getByTestId('url-path').type(url)
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText('Network imported')
  })
  test('import failure using url', async () => {
    const url =
      'https://githubusercontent.com/vegaprotocol/networks/master/mainnet1/fake.toml'
    await page.getByTestId('url-path').type(url)
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText(
      'Error: could not fetch the network configuration'
    )
  })

  // Skipped until bug fixed
  // https://github.com/vegaprotocol/vegawallet-desktop/issues/561
  test.fixme('import successfully via file path', async () => {
    const filePath = `file://${join(
      process.cwd(),
      'automation/data/networks/mainnet1.toml'
    )}`

    // 0001-WALL-010
    await page.getByTestId('url-path').type(filePath)
    await page.getByTestId('network-name').type('custom')
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText('Network imported')
  })

  test('import failure via file path', async () => {
    const invalidFilePath = 'this/is/invalid/path/file.toml'

    await page.getByTestId('url-path').type(invalidFilePath)
    await page.getByTestId('network-name').type('custom')
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText(
      'Error: the network source file does not exist: invalid network source'
    )
  })

  test('overwrite network that already exists', async () => {
    await page.getByTestId('url-path').type(url)
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText(
      'Error: a network with the same name already exists'
    )
    // overwrite message shown, check overwrite and re submit
    await expect(page.getByTestId('toast')).toBeHidden()
    await page.locator('button[role="checkbox"]').click()
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText('Network imported')
  })

  test('import same network with different name', async () => {
    await page.getByTestId('url-path').type(url)
    await page.getByTestId('network-name').type(`custom-${Date.now()}`)
    await page.getByTestId('import-network').click()
    await expect(page.getByTestId('toast')).toContainText('Network imported')
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
