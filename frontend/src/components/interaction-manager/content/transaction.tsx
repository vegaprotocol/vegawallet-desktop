import { useCallback } from 'react'

import { useGlobal } from '../../../contexts/global/global-context'
import { formatDate } from '../../../lib/date'
import { parseTransaction, TransactionKeys } from '../../../lib/transactions'
import { Button } from '../../button'
import { ButtonGroup } from '../../button-group'
import { CodeBlock } from '../../code-block'
import { Dialog } from '../../dialog'
import { PublicKey } from '../../public-key'
import { Title } from '../../title'
import type {
  InteractionContentProps,
  RequestTransactionSending
} from '../types'
import { INTERACTION_RESPONSE_TYPE } from '../types'

const TRANSACTION_TITLES: Record<TransactionKeys, string> = {
  [TransactionKeys.UNKNOWN]: 'Unknown transaction',
  [TransactionKeys.ORDER_SUBMISSION]: 'Order submission',
  [TransactionKeys.ORDER_CANCELLATION]: 'Order cancellation',
  [TransactionKeys.ORDER_AMENDMENT]: 'Order amendment',
  [TransactionKeys.VOTE_SUBMISSION]: 'Vote submission',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'Withdraw submission',
  [TransactionKeys.LIQUIDTY_PROVISION_SUBMISSION]: 'Liquidity provision',
  [TransactionKeys.LIQUIDTY_PROVISION_CANCELLATION]:
    'Liquidity provision cancellation',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]:
    'Liquidity provision amendment',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'Proposal submission',
  [TransactionKeys.ANNOUNCE_NODE]: 'Announce node',
  [TransactionKeys.NODE_VOTE]: 'Node vote',
  [TransactionKeys.NODE_SIGNATURE]: 'Node signature',
  [TransactionKeys.CHAIN_EVENT]: 'Chain event',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'Oracle data submission',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'Undelegate submission',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'Delegate submission',
  [TransactionKeys.TRANSFER]: 'Transfer',
  [TransactionKeys.CANCEL_TRANSFER]: 'Cancel transfer',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'Key rotation submission',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]:
    'Ethereum key rotation submission'
}

const TRANSACTION_DESCRIPTIONS: Record<TransactionKeys, string> = {
  [TransactionKeys.UNKNOWN]: 'submit an unknown transaction',
  [TransactionKeys.ORDER_SUBMISSION]: 'submit an order',
  [TransactionKeys.ORDER_CANCELLATION]: 'cancel an order',
  [TransactionKeys.ORDER_AMENDMENT]: 'amend an order',
  [TransactionKeys.VOTE_SUBMISSION]: 'submit a vote for a governance proposal',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'withdraw funds',
  [TransactionKeys.LIQUIDTY_PROVISION_SUBMISSION]: 'provide liquidity',
  [TransactionKeys.LIQUIDTY_PROVISION_CANCELLATION]:
    'cancel a liquidity provision',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]:
    'amend a liquidity provision',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'submit a governance proposal',
  [TransactionKeys.ANNOUNCE_NODE]: 'announce a node',
  [TransactionKeys.NODE_VOTE]: 'submit a node vote',
  [TransactionKeys.NODE_SIGNATURE]: 'submit a node signature',
  [TransactionKeys.CHAIN_EVENT]: 'submit a chain event',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'submit oracle data',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'undelegate stake to a node',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'delegate stake to a node',
  [TransactionKeys.TRANSFER]: 'transfer assets',
  [TransactionKeys.CANCEL_TRANSFER]: 'cancel a recurring transfer',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'submit a key rotation',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]:
    'submit an Ethereum key rotation'
}

export const Transaction = ({
  interaction
}: InteractionContentProps<RequestTransactionSending>) => {
  const { service } = useGlobal()
  const transaction = parseTransaction(interaction.event.data)
  const title = TRANSACTION_TITLES[transaction.type]
  const description = TRANSACTION_DESCRIPTIONS[transaction.type]

  const onReponse = useCallback(
    async (decision: boolean) => {
      // @ts-ignore
      await service.RespondToInteraction({
        traceID: interaction.event.traceID,
        name: INTERACTION_RESPONSE_TYPE.DECISION,
        data: {
          approved: decision
        }
      })

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          ...interaction.event.data,
          decision
        }
      })
    },
    [service, interaction]
  )

  return (
    <Dialog open={true} size='lg' title={title}>
      <div style={{ padding: '0 20px 20px' }}>
        <p>
          <pre>{transaction.hostname}</pre> requested to use your key to{' '}
          {description} from <pre>{transaction.wallet}</pre>.
        </p>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <Title style={{ margin: '0 0 6px' }}>Wallet</Title>
        <p>{transaction.wallet}</p>
      </div>
      <PublicKey publicKey={transaction.publicKey} />
      <div style={{ padding: '20px 20px 0' }}>
        <Title style={{ margin: '0 0 12px' }}>Transaction details</Title>
        <CodeBlock style={{ fontSize: 12, marginBottom: 0 }}>
          <pre data-testid='transaction-payload'>
            {JSON.stringify(transaction.payload, null, 2)}
          </pre>
        </CodeBlock>
      </div>
      <div style={{ padding: '20px 20px 0' }}>
        <Title style={{ margin: '0 0 6px' }}>Received</Title>
        <p>{formatDate(new Date(transaction.receivedAt))}</p>
      </div>
      <div style={{ padding: 20 }}>
        <ButtonGroup>
          <Button
            data-testid='wallet-transaction-request-approve'
            onClick={() => onReponse(true)}
          >
            Approve
          </Button>
          <Button
            data-testid='wallet-transaction-request-reject'
            onClick={() => onReponse(false)}
          >
            Reject
          </Button>
        </ButtonGroup>
      </div>
    </Dialog>
  )
}
