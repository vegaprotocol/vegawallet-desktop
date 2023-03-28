import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export default async function waitForNetworkConnected(page: Page) {
  await expect(page.getByTestId('service-status')).not.toContainText(
    'Not running',
    { timeout: 15 * 1000 }
  )
  await expect(page.getByTestId('service-status')).not.toContainText(
    'Loading',
    { timeout: 20 * 1000 }
  )
}
