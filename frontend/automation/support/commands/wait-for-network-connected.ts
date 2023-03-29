import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export default async function waitForNetworkConnected(page: Page) {
  const serviceStatus = page.getByTestId('service-status')
  await expect(serviceStatus).not.toContainText(/^(Not running|Loading)$/, {
    timeout: 30 * 1000
  })
}
