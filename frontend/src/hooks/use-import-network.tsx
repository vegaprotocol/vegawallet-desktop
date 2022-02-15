import * as Sentry from '@sentry/react'
import React from 'react'

import { CodeBlock } from '../components/code-block'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { addNetworkAction } from '../contexts/network/network-actions'
import { useNetwork } from '../contexts/network/network-context'
import type { ImportNetworkResponse } from '../models/network'
import { Service } from '../service'
import { FormStatus, useFormState } from './use-form-state'

export function useImportNetwork() {
  const { dispatch } = useNetwork()
  const [status, setStatus] = useFormState()
  const [response, setResponse] = React.useState<ImportNetworkResponse | null>(
    null
  )
  const [error, setError] = React.useState<string | null>(null)

  const submit = React.useCallback(
    async (values: { name: string; fileOrUrl: string; force: boolean }) => {
      const isUrl = /^(http|https):\/\/[^ "]+$/i.test(values.fileOrUrl)
      try {
        setStatus(FormStatus.Pending)
        const res = await Service.ImportNetwork({
          name: values.name,
          url: isUrl ? values.fileOrUrl : '',
          filePath: !isUrl ? values.fileOrUrl : '',
          force: values.force
        })

        if (res) {
          const config = await Service.GetNetworkConfig(res.name)

          // Update the config
          dispatch(addNetworkAction(res.name, config))

          setStatus(FormStatus.Success)
          setResponse(res)

          AppToaster.show({
            message: (
              <div>
                <p>Network imported to:</p>
                <p>
                  <CodeBlock style={{ background: 'transparent' }}>
                    {res.filePath}
                  </CodeBlock>
                </p>
              </div>
            ),
            intent: Intent.SUCCESS,
            timeout: 0
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
        Sentry.captureException(err)
        // @ts-ignore
        setError(err)
        setStatus(FormStatus.Error)
        AppToaster.show({
          message: `Error: ${err}`,
          intent: Intent.DANGER
        })
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
