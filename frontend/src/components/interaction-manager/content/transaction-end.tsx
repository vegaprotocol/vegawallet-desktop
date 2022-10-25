import { useEffect, useMemo } from 'react'

import type { Wallet } from '../../../contexts/global/global-context'
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

type TransactionEndProps =
  | InteractionContentProps<RequestTransactionSuccess>
  | InteractionContentProps<RequestTransactionFailure>

type TransactionEvent = RequestTransactionSuccess | RequestTransactionFailure

type InputData = {
  blockHeight: string
}

const parseInputData = (inputData: string) => {
  try {
    const { blockHeight } = JSON.parse(inputData) as InputData
    return { blockHeight: parseInt(blockHeight, 10) }
  } catch (err) {
    return {}
  }
}

type Tx = {
  signature: {
    value: string
  }
}

const parseTx = (tx: string) => {
  try {
    const { signature } = JSON.parse(tx) as Tx
    return { signature: signature.value }
  } catch (err) {
    return {}
  }
}

const parseEvent = (event: TransactionEvent) => {
  const isSuccess = event.name === INTERACTION_TYPE.TRANSACTION_SUCCEEDED
  const txData = parseTx(event.data.tx)
  const inputData = parseInputData(event.data.deserializedInputData)

  return {
    ...txData,
    ...inputData,
    status: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.FAILURE,
    txHash:
      event.name === INTERACTION_TYPE.TRANSACTION_SUCCEEDED
        ? event.data.txHash
        : null,
    error:
      event.name === INTERACTION_TYPE.TRANSACTION_FAILED
        ? event.data.error
        : undefined
  }
}

const getTransaction = (
  wallets: Record<string, Wallet>,
  source: Interaction<RequestTransactionReview> | null,
  event: TransactionEvent
) => {
  if (!source) {
    return null
  }

  const { wallet, publicKey } = source.event.data
  return (
    wallets[wallet]?.keypairs?.[publicKey]?.transactions[event.traceID] || null
  )
}

export const TransactionEnd = ({
  interaction,
  history,
  isResolved,
  setResolved
}: TransactionEndProps) => {
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
    const transaction = getTransaction(state.wallets, source, interaction.event)

    if (!isResolved && transaction) {
      dispatch({
        type: 'UPDATE_TRANSACTION',
        transaction: {
          ...transaction,
          ...parseEvent(interaction.event)
        }
      })

      setResolved(true)
    }
  }, [source, state, dispatch, interaction, isResolved, setResolved])

  return null
}
