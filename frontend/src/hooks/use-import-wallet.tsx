import React from 'react'

import { CodeBlock } from '../components/code-block'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { addWalletAction } from '../contexts/global/global-actions'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import { Service } from '../service'
import { wallet } from '../wailsjs/go/models'

const logger = createLogger('UseImportWallet')

export function useImportWallet() {
  const { dispatch } = useGlobal()
  const [response, setResponse] = React.useState<wallet.ImportWalletResponse | null>(
    null
  )
  const [error, setError] = React.useState<Error | null>(null)

  const submit = React.useCallback(
    async (values: {
      wallet: string
      passphrase: string
      recoveryPhrase: string
      version: number
    }) => {
      logger.debug('ImportWallet')
      try {
        const resp = await Service.ImportWallet({
          wallet: values.wallet,
          passphrase: values.passphrase,
          recoveryPhrase: values.recoveryPhrase,
          version: Number(values.version)
        })
        if (resp) {
          setResponse(resp)
          dispatch(addWalletAction(values.wallet, resp.key))
          AppToaster.show({
            message: (
              <div>
                <p>Wallet imported to:</p>
                <p>
                  <CodeBlock style={{ background: 'transparent' }}>
                    {resp.wallet.filePath}
                  </CodeBlock>
                </p>
              </div>
            ),
            intent: Intent.SUCCESS,
            timeout: 0
          })
        } else {
          AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
          setError(new Error('Something went wrong'))
        }
      } catch (err) {
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        setError(err as Error)
        logger.error(err)
      }
    },
    [dispatch]
  )

  return {
    response,
    submit,
    error
  }
}
