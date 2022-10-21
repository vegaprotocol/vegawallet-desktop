// import { Colors } from '../../config/colors'
//
// const statusStyles = {
//   display: 'inline-block',
//   padding: '0.25rem 0.5rem',
//   margin: '0.5rem 0.5rem 0.5rem 0',
//   borderRadius: 2
// }

// const TransactionStatus = ({ isSuccess }: { isSuccess: boolean }) => {
//   if (isSuccess) {
//     return (
//       <span
//         style={{
//           ...statusStyles,
//           backgroundColor: Colors.INTENT_SUCCESS
//         }}
//       >
//         Approved
//       </span>
//     )
//   }
//   return (
//     <span
//       style={{
//         ...statusStyles,
//         backgroundColor: Colors.INTENT_DANGER
//       }}
//     >
//       Failed
//     </span>
//   )
// }

// @TODO: style and intergate when more data is available
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const TransactionItem = ({
//   transaction
// }: {
//   transaction: Transaction
// }) => {
//   ;<div
//     key={transaction.txId}
//     style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     }}
//   >
//     <div>
//       <TransactionStatus isSuccess={!transaction.error} />
//       <span>transaction id: {transaction.txId}</span>
//     </div>
//     <div>{formatDate(new Date(transaction.sentAt))}</div>
//   </div>
// }

export const TransactionHistory = () => {
  return (
    <>
      <div>No transactions in history.</div>
    </>
  )
}
