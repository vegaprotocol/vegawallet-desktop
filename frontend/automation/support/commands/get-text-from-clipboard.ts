import type { Page } from '@playwright/test'

export default async function getTextFromClipboard(
  page: Page
): Promise<string> {
  return page.evaluate('navigator.clipboard.readText()')
}
