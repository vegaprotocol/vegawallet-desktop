import { useCallback, useEffect, useState } from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import type { Logger } from '../lib/logging'

type SubscriptionArgs<T> = {
  getData: () => Promise<T[]>
  subscribe: (callback: (data: T) => void) => () => void
  logger: Logger
}

export function useSubscription<T>({
  getData,
  subscribe,
  logger
}: SubscriptionArgs<T>) {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState<T[] | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refetch = useCallback(() => getData(), [])

  const submit = useCallback(async () => {
    logger.debug('GetData')
    setLoading(true)
    try {
      const response = await getData()
      setData(response)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
      logger.error(err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    submit()
    const unsubscribe = subscribe(newData => {
      logger.debug('GetSubscriptionData')
      setData(data => [...(data || []), newData])
    })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoading,
    refetch,
    data
  }
}
