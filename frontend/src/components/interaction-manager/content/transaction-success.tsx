import { useEffect, useMemo } from 'react'
import { useGlobal } from '../../../contexts/global/global-context'
import { TransactionStatus } from '../../../lib/transactions'
import { INTERACTION_TYPE } from '../types'
import type {
  Interaction,
  InteractionContentProps,
  RequestTransactionReview,
  RequestTransactionSuccess
} from '../types'

export const TransactionSuccess = ({
  interaction,
  history,
  isResolved,
}: InteractionContentProps<RequestTransactionSuccess>) => {
  const { dispatch, state } = useGlobal()
  const source = useMemo(() => (
    history.find(({ event }) => (
      event.name === INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING
    )) as Interaction<RequestTransactionReview> | null
  ), [history])

  useEffect(() => {
    if (source) {
      const { wallet, publicKey } = source.event.data
      const transaction = state.wallets[wallet]?.keypairs?.[publicKey]?.transactions[interaction.event.traceID]

      if (transaction) {
        dispatch({
          type: 'UPDATE_TRANSACTION',
          transaction: {
            ...transaction,
            status: TransactionStatus.SUCCESS,
            txHash: interaction.event.data.txHash,
          }
        })
      }
    }
  }, [source, isResolved])

  return null
}
