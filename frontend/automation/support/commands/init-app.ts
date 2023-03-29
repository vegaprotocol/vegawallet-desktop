import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { execSync } from 'child_process'

import data from '../../data/test-data.json'

export default async function initApp(page: Page) {
  execSync('yarn run e2e:clean')
  await page.goto('/')
  await expect(page.getByTestId('splash-loader')).toBeHidden()
  const body = JSON.stringify({ vegaHome: data.vegaHome })
  await page.evaluate(`go.backend.Handler.InitialiseApp(${body})`)
}
