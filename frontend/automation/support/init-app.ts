import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { execSync } from 'child_process'

import data from '../data/test-data.json'

export default async function initApp(page: Page) {
  const platform = process.platform
  if (platform === 'win32') {
    execSync(
      'rmdir /s automation\\test-wallets; mkdir automation\\test-wallets'
    )
    // code for removing the wallet service on windows
  } else {
    execSync('rm -r automation/test-wallets; mkdir automation/test-wallets')
  }
  await page.goto('/')
  await expect(page.getByTestId('splash-loader')).toBeHidden()
  const body = JSON.stringify({ vegaHome: data.vegaHome })
  await page.evaluate(`go.backend.Handler.InitialiseApp(${body})`)
}
