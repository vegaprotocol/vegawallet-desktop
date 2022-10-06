export const enum EVENT_FLOW_TYPE {
  WALLET_CONNECTION = 'WALLET_CONNECTION',
  TRANSACTION_CONSENT = 'TRANSACTION_CONSENT'
}

export type InteractionContentProps<T extends RawInteraction = RawInteraction> =
  {
    interaction: Interaction<T>
    flow?: EVENT_FLOW_TYPE
    isResolved: boolean
    setResolved: () => void
    onFinish: () => void
  }

// Received interaction content

export interface ErrorOccurredContent {
  name: string
  error: string
}

export interface LogContent {
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
}

export interface RequestWalletConnectionContent {
  hostname: string
}

export interface RequestWalletSelectionContent {
  hostname: string
  availableWallets: string[]
}

export interface RequestPassphraseContent {
  wallet: string
}

export interface RequestPermissionsContent {
  hostname: string
  wallet: string
  permissions: Map<string, string>
}

export interface RequestTransactionSendingContent {
  hostname: string
  wallet: string
  publicKey: string
  transaction: string
  receivedAt: string
}

export interface RequestTransactionSigningContent {
  hostname: string
  wallet: string
  publicKey: string
  transaction: string
  receivedAt: string
}

export interface TransactionStatusContent {
  txHash: string
  tx: string
  error: string
  sentAt: string
}

export interface RequestSucceededContent {
}

// Received interaction events

export const enum INTERACTION_TYPE {
  INTERACTION_SESSION_BEGAN = 'INTERACTION_SESSION_BEGAN',
  INTERACTION_SESSION_ENDED = 'INTERACTION_SESSION_ENDED',
  REQUEST_WALLET_CONNECTION_REVIEW = 'REQUEST_WALLET_CONNECTION_REVIEW',
  REQUEST_WALLET_SELECTION = 'REQUEST_WALLET_SELECTION',
  REQUEST_SUCCEEDED = 'REQUEST_SUCCEEDED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  LOG = 'LOG',
}

export type RequestWalletConnection = {
  traceID: string
  name: INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW
  data: RequestWalletConnectionContent
}

export type RequestWalletSelection = {
  traceID: string
  name: INTERACTION_TYPE.REQUEST_WALLET_SELECTION
  data: RequestWalletSelectionContent
}

export type RequestSucceeded = {
  traceID: string
  name: INTERACTION_TYPE.REQUEST_SUCCEEDED
  data: RequestSucceededContent
}

export type ErrorOccurred = {
  traceID: string
  name: INTERACTION_TYPE.ERROR_OCCURRED
  data: ErrorOccurredContent
}

export type Log = {
  traceID: string
  name: INTERACTION_TYPE.LOG
  data: LogContent
}

export type SessionStarted = {
  traceID: string
  name: INTERACTION_TYPE.INTERACTION_SESSION_BEGAN
}

export type SessionEnded = {
  traceID: string
  name: INTERACTION_TYPE.INTERACTION_SESSION_ENDED
}

export type RawInteraction =
  | RequestWalletConnection
  | RequestWalletSelection
  | RequestSucceeded
  | ErrorOccurred
  | Log
  | SessionStarted
  | SessionEnded

export type Interaction<T extends RawInteraction = RawInteraction> = {
  meta: {
    id: string
  }
  event: T
}

// Responses

export const enum INTERACTION_RESPONSE_TYPE {
  DECISION = 'DECISION',
  ENTERED_PASSPHRASE = 'ENTERED_PASSPHRASE',
  WALLET_CONNECTION_DECISION = 'WALLET_CONNECTION_DECISION',
  SELECTED_WALLET = 'SELECTED_WALLET',
}

// response data types

export interface EnteredPassphrase {
  passphrase: string
}

export interface WalletConnectionDecision {
  connectionApproval: string
}

export interface SelectedWallet {
  wallet: string
  passphrase: string
}

export interface Decision {
  approved: boolean
}

// response types

export type InteractionResponseEnteredPassphrase = {
  traceID: string
  name: INTERACTION_RESPONSE_TYPE.ENTERED_PASSPHRASE
  data: EnteredPassphrase
}

export type InteractionResponseWalletConnectionDecision = {
  traceID: string
  name: INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION
  data: WalletConnectionDecision
}

export type InteractionResponseSelectedWallet = {
  traceID: string
  name: INTERACTION_RESPONSE_TYPE.SELECTED_WALLET
  data: SelectedWallet
}

export type InteractionResponseDecision = {
  traceID: string
  name: INTERACTION_RESPONSE_TYPE.DECISION
  data: Decision
}

export type InteractionResponse =
  | InteractionResponseEnteredPassphrase
  | InteractionResponseWalletConnectionDecision
  | InteractionResponseSelectedWallet
  | InteractionResponseDecision
