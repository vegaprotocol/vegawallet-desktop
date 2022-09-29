import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'
// import { createLogger } from '../lib/logging'
import type { WalletModel } from '../wallet-client'
import { JSONRPCError } from '../wallet-client'
import { FormStatus, useFormState } from './use-form-state'

// const logger = createLogger('UseImportNetwork')

interface ImportNetworkArgs {
  name: string
  network: string
  fileOrUrl: string
  force: boolean
}

export function useImportNetwork() {
  const { actions, service, dispatch } = useGlobal()
  const [status, setStatus] = useFormState()
  const [response, setResponse] =
    React.useState<WalletModel.DescribeNetworkResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const submit = React.useCallback(
    async (values: ImportNetworkArgs) => {
      setStatus(FormStatus.Pending)
      const { name, url, filePath, force } = createImportNetworkArgs(values)

      try {
        const res = await service.WalletApi.ImportNetwork({
          name,
          filePath,
          url,
          overwrite: force
        })

        if (res && res.name) {
          const config = await service.WalletApi.DescribeNetwork({
            network: res.name
          })

          // Update the config
          dispatch(actions.addNetworkAction(res.name, config))

          setStatus(FormStatus.Success)
          setResponse(res)

          AppToaster.show({
            message: `Network imported to: ${res.filePath}`,
            intent: Intent.SUCCESS
          })
        } else {
          throw new Error("Error: couldn't import network configuration")
        }
      } catch (err: unknown) {
        const message = "Error: couldn't import network configuration"
        setError(
          message + (err instanceof JSONRPCError ? ` - ${err.message}` : '')
        )
        setStatus(FormStatus.Error)
        AppToaster.show({
          message,
          intent: Intent.DANGER
        })
      }
    },
    [dispatch, setStatus, service, actions]
  )

  return {
    status,
    response,
    submit,
    error
  }
}

function createImportNetworkArgs(values: ImportNetworkArgs) {
  // Other option is selected so figure out whether the fileOrUrl input is a url or not
  // and use the relevent object property
  if (values.network === 'other') {
    const isUrl = /^(http|https):\/\/[^ "]+$/i.test(values.fileOrUrl)
    return {
      name: values.name,
      url: isUrl ? values.fileOrUrl : '',
      filePath: !isUrl ? values.fileOrUrl : '',
      force: values.force
    }
  }

  // One of the presets have been used
  return {
    name: '',
    url: values.network,
    filePath: '',
    force: false
  }
}
