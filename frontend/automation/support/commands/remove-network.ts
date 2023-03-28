import type { Page } from '@playwright/test'

type NetworksResponse = { result: { networks: { name: string }[] } }

export default async function removeNetwork(
  page: Page,
  name?: string
): Promise<void> {
  if (name) {
    const body = JSON.stringify({
      id: '0',
      jsonrpc: '2.0',
      method: 'admin.remove_network',
      params: { name }
    })
    await page.evaluate(
      `window.go.backend.Handler.SubmitWalletAPIRequest(${body})`
    )
  } else {
    return await listNetworks(page).then(networks =>
      networks.forEach(async name => removeNetwork(page, name))
    )
  }
}

async function listNetworks(page: Page): Promise<string[]> {
  const res = (await page.evaluate(
    `window.go.backend.Handler.SubmitWalletAPIRequest({id: '0',jsonrpc: '2.0',method: 'admin.list_networks'})`
  )) as NetworksResponse
  return res.result.networks.map((network: { name: string }) => network.name)
}
