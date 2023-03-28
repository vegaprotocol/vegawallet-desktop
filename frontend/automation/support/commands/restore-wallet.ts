import { type Page } from 'playwright'

export default async function restoreWallet(page: Page) {
  const passphrase = '123'
  const recoveryPhrase =
    (process.env.testWalletRecoveryPhrase as string) ||
    'brown eternal intact name raw memory squeeze three social road click little gadget vote kitchen best split hungry rail coin season visa category hold'
  const body = JSON.stringify({
    id: '0',
    jsonrpc: '2.0',
    method: 'admin.import_wallet',
    params: {
      wallet: 'test',
      recoveryPhrase: recoveryPhrase,
      keyDerivationVersion: 2,
      passphrase
    }
  })
  const res: any = await page.evaluate(
    `window.go.backend.Handler.SubmitWalletAPIRequest(${body})`
  )
  if ('error' in res) throw new Error(JSON.stringify(res.error))
  else return res.result
}
