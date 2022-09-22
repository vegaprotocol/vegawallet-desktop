import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import { FormStatus, useFormState } from './use-form-state'
import { WalletModel } from '../wallet-client'

const logger = createLogger('UseImportNetwork')

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
    React.useState<WalletModel.DescribeNetworkResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const submit = React.useCallback(
    async (values: ImportNetworkArgs) => {
      try {
        setStatus(FormStatus.Pending)

        const { name, url, filePath, force } = createImportNetworkArgs(values)
        const res = await service.WalletApi.ImportNetwork(
          name,
          filePath,
          url,
          force,
        )

        if (res && res.name) {
          const config = await service.WalletApi.DescribeNetwork(res.name)

          // Update the config
          dispatch(actions.addNetworkAction(res.name, config))

          setStatus(FormStatus.Success)
          setResponse(res)

          AppToaster.show({
            message: `Network imported to: ${res.filePath}`,
            intent: Intent.SUCCESS
          })
        } else {
          const message = 'Error: Could not import network'
          setError(message)
          setStatus(FormStatus.Error)
          AppToaster.show({
            message,
            intent: Intent.DANGER
          })
        }
      } catch (err) {
        // @ts-ignore
        setError(err)
        setStatus(FormStatus.Error)
        AppToaster.show({
          message: `${err}`,
          intent: Intent.DANGER
        })
        logger.error(err)
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

function createImportNetworkArgs(
  values: ImportNetworkArgs
) {
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
