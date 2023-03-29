import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/commands/init-app'
import waitForNetworkConnected from '../support/commands/wait-for-network-connected'

const homeSettingsBtn = 'home-settings'
const settingsForm = 'settings-form'
const cancelSettingsBtn = 'cancel-settings'

test.describe('settings', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await page.goto('/')
    await waitForNetworkConnected(page)
  })

  test('dialog opens and can be closed', async () => {
    await page.getByTestId(homeSettingsBtn).click()
    await expect(page.getByTestId(settingsForm)).toBeVisible()
    await page.getByTestId(cancelSettingsBtn).click()
    await expect(page.getByTestId(settingsForm)).toBeHidden()
  })

  test('saves and reloads', async () => {
    await page.getByTestId(homeSettingsBtn).click()
    await expect(page.getByTestId(settingsForm)).toBeVisible()

    // assert and change log level
    await expect(page.getByTestId('log-level').last()).toHaveValue('info')
    await page.getByTestId('log-level').last().selectOption('debug')

    // change telemetry
    const radioGroupLocator = page.getByRole('radiogroup')
    await expect(radioGroupLocator.locator('input[value="yes"]')).toBeChecked()
    await radioGroupLocator.locator('button[value="no"]').click()

    // submit
    await page.getByTestId('update-settings').click()

    // page should reload and settings form should now not show
    await expect(page.getByTestId(settingsForm)).toBeHidden()

    await page.getByTestId(homeSettingsBtn).click()
    await expect(page.getByTestId('log-level').last()).toHaveValue('debug')
    await expect(radioGroupLocator.locator('input[value="no"]')).toBeChecked()
    await page.getByTestId(cancelSettingsBtn).click()
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
