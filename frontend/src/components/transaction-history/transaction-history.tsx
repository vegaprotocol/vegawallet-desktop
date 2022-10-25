import { useState } from 'react'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { sortTransaction } from '../../lib/transactions'
import { Dialog } from '../dialog'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { ButtonGroup } from '../button-group'
import { TransactionDetails } from '../transaction-details'
import { TransactionItem } from './transaction-item'
import type { Transaction } from '../../lib/transactions'
import { TRANSACTION_TITLES } from '../interaction-manager/content/transaction'

export const TransactionHistory = () => {
  const { keypair } = useCurrentKeypair()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const transactionList = Object.values(keypair?.transactions || []).sort(
    sortTransaction
  )

  return (
    <>
      {transactionList.length === 0 && <div>No transactions in history.</div>}
      {transactionList.length > 0 &&
        transactionList.map((item, index) => (
          <TransactionItem
            key={index}
            transaction={item}
            viewDetails={() => setTransaction(item)}
          />
        ))
      }
      <Dialog
        size="lg"
        open={!!transaction}
        title={transaction ? TRANSACTION_TITLES[transaction.type] : ''}
        onChange={(open) => setTransaction(open ? transaction : null)}
      >
        {transaction && <TransactionDetails transaction={transaction} />}
        <ButtonGroup inline style={{ padding: 20 }}>
          <Button>View in explorer</Button>
          <ButtonUnstyled onClick={() => setTransaction(null)}>Close</ButtonUnstyled>
        </ButtonGroup>
      </Dialog>
    </>
  )
}
