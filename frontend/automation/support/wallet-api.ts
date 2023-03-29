import type { Page } from '@playwright/test'
import { join } from 'path'

import data from '../data/test-data.json'

type NetworksResponse = { result: { networks: { name: string }[] } }

export async function removeNetwork(page: Page, name?: string): Promise<void> {
  if (name) {
    const params = { name }
    await submitWalletAPIRequest(page, 'admin.remove_network', params)
  } else {
    return await listNetworks(page).then(networks =>
      networks.forEach(async name => removeNetwork(page, name))
    )
  }
}

export async function restoreNetwork(page: Page, name = 'test') {
  const params = {
    url: `file://${join(process.cwd(), '/automation/data/networks/test.toml')}`,
    name
  }
  const res: any = await submitWalletAPIRequest(
    page,
    'admin.import_network',
    params
  )
  if ('error' in res) throw new Error(JSON.stringify(res.error))
  else return res.result
}

export async function restoreWallet(page: Page) {
  const params = {
    wallet: 'test',
    recoveryPhrase: data.testWalletRecoveryPhrase,
    keyDerivationVersion: 2,
    passphrase: '123'
  }
  const res: any = await submitWalletAPIRequest(
    page,
    'admin.import_wallet',
    params
  )
  if ('error' in res) throw new Error(JSON.stringify(res.error))
  else return res.result
}

async function listNetworks(page: Page): Promise<string[]> {
  const res = (await page.evaluate(
    `window.go.backend.Handler.SubmitWalletAPIRequest({id: '0',jsonrpc: '2.0',method: 'admin.list_networks'})`
  )) as NetworksResponse
  return res.result.networks.map((network: { name: string }) => network.name)
}

async function submitWalletAPIRequest(
  page: Page,
  method: string,
  params?: any
) {
  const body = JSON.stringify({
    id: '0',
    jsonrpc: '2.0',
    method,
    params
  })
  return await page.evaluate(
    `window.go.backend.Handler.SubmitWalletAPIRequest(${body})`
  )
}
