import type { Page } from '@playwright/test'
import { join } from 'path'

export default async function restoreNetwork(page: Page, name = 'test') {
  const body = {
    id: '0',
    jsonrpc: '2.0',
    method: 'admin.import_network',
    params: {
      url: `file://${join(
        process.cwd(),
        '/automation/data/networks/test.toml'
      )}`,
      name
    }
  }

  const res: any = await page.evaluate(
    `window.go.backend.Handler.SubmitWalletAPIRequest(${JSON.stringify(body)})`
  )
  if ('error' in res) throw new Error(JSON.stringify(res.error))
  else return res.result
}
