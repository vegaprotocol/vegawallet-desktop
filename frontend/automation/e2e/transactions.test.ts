import {expect,test} from '@playwright/test'

import initApp from '../support/init-app'

test.describe('transactions view', () => {
    test.beforeEach(async ({ page }) => {
        await initApp(page)
        await page.goto('/')
    })

test('can navigate to transactions page', async ({page}) => {
    await page.locator('a[href="#/transactions"]').click()
    await expect(page.getByTestId('Transactions-header')).toHaveText('Transactions')
  })
})