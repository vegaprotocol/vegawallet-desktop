import React, { useState } from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { createLogger } from '../lib/logging'
import { Service } from '../service'
import type { backend as BackendModel } from '../wailsjs/go/models'

const logger = createLogger('UseTransactions')

export function useTransactions() {
  const [isLoading, setLoading] = useState(false)
  const [response, setResponse] =
    React.useState<BackendModel.SentTransaction[] | null>(null)

  const submit = React.useCallback(
    async () => {
      logger.debug('ListTransactions')
      setLoading(true)
      try {
        const resp = await Service.ListSentTransactions()
        setResponse(resp.transactions)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    []
  )

  return {
    isLoading,
    transactions: response,
    submit,
  }
}
