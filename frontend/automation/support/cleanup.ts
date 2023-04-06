import type { Page } from '@playwright/test'

export default async function cleanup(page: Page) {
  // Stop any running services
  await page.evaluate('go.backend.Handler.StopService()')
  await page.close()
}
