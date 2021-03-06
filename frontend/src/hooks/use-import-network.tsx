import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { addNetworkAction } from '../contexts/global/global-actions'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import { Service } from '../service'
import type { network as NetworkModel } from '../wailsjs/go/models'
import { FormStatus, useFormState } from './use-form-state'

const logger = createLogger('UseImportNetwork')

interface ImportNetworkArgs {
  name: string
  network: string
  fileOrUrl: string
  force: boolean
}

export function useImportNetwork() {
  const { dispatch } = useGlobal()
  const [status, setStatus] = useFormState()
  const [response, setResponse] =
    React.useState<NetworkModel.ImportNetworkFromSourceResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const submit = React.useCallback(
    async (values: ImportNetworkArgs) => {
      try {
        setStatus(FormStatus.Pending)

        const args = createImportNetworkArgs(values)
        const res = await Service.ImportNetwork(args)

        if (res) {
          const config = await Service.GetNetworkConfig(res.name)

          // Update the config
          dispatch(addNetworkAction(res.name, config))

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
    [dispatch, setStatus]
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
): NetworkModel.ImportNetworkFromSourceRequest {
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
