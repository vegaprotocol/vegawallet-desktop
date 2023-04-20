import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import cleanup from '../support/cleanup'
import initApp from '../support/init-app'

const homeSettingsBtn = 'a[href="#/settings"]'
const settingsForm = 'Settings'
const appSettingsButton = 'a[href="#/settings/app-settings"]'
const appSettingsForm = 'App settings'

test.describe('settings', () => {
  let page: Page
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await initApp(page)
    await page.goto('/')
  })

  test('saves and reloads', async () => {
    await page.locator(homeSettingsBtn).click()
    await expect(page.getByTestId(settingsForm)).toBeVisible()

    // change app settings
    await page.locator(appSettingsButton).click()
    await expect(page.getByTestId(appSettingsForm)).toBeVisible()

    // assert and change log level
    await page.locator('#logLevel').selectOption('debug')

    // change telemetry
    const radioGroupLocator = page.getByRole('radiogroup')
    await radioGroupLocator.getByTestId('no').click()

    // submit
    await page.getByTestId('update-settings').click()

    await page.locator(homeSettingsBtn).click()
    await page.locator(appSettingsButton).click()

    expect(
      await page.evaluate('document.querySelector("#logLevel").value')
    ).toEqual('debug')
    await expect(radioGroupLocator.getByTestId('no')).toHaveAttribute(
      'aria-checked',
      'true'
    )
  })

  test.afterAll(async () => {
    await cleanup(page)
  })
})
