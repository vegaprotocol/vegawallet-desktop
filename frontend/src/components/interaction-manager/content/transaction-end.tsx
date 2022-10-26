import { useEffect, useMemo } from 'react'

import { useGlobal } from '../../../contexts/global/global-context'
import { TransactionStatus } from '../../../lib/transactions'
import type {
  Interaction,
  InteractionContentProps,
  RequestTransactionFailure,
  RequestTransactionReview,
  RequestTransactionSuccess
} from '../types'
import { INTERACTION_TYPE } from '../types'

export const TransactionEnd = ({
  event,
  history,
  isResolved,
  setResolved
}:
  | InteractionContentProps<RequestTransactionSuccess>
  | InteractionContentProps<RequestTransactionFailure>) => {
  const { dispatch, state } = useGlobal()
  const source = useMemo(
    () =>
      history.find(
        ({ event }) =>
          event.name === INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING
      ) as Interaction<RequestTransactionReview> | null,
    [history]
  )

  useEffect(() => {
    if (source && !isResolved) {
      const { wallet, publicKey } = source.event.data
      const transaction =
        state.wallets[wallet]?.keypairs?.[publicKey]?.transactions[
          event.traceID
        ]

      if (transaction) {
        const isSuccess = event.name === INTERACTION_TYPE.TRANSACTION_SUCCEEDED

        dispatch({
          type: 'UPDATE_TRANSACTION',
          transaction: {
            ...transaction,
            status: isSuccess
              ? TransactionStatus.SUCCESS
              : TransactionStatus.FAILURE,
            txHash:
              event.name === INTERACTION_TYPE.TRANSACTION_SUCCEEDED
                ? event.data.txHash
                : null
          }
        })
      }

      setResolved(true)
    }
  }, [source, state, dispatch, event, isResolved, setResolved])

  return null
}
