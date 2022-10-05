export const enum EVENT_FLOW_TYPE {
  WALLET_CONNECTION = 'WALLET_CONNECTION',
  TRANSACTION_CONSENT = 'TRANSACTION_CONSENT',
}

export type InteractionContentProps<T extends RawInteraction = RawInteraction> = {
  interaction: Interaction<T>
  flow?: EVENT_FLOW_TYPE
  isResolved: boolean
  setResolved: () => void
  onFinish: () => void
}

// Received interaction content

export interface ErrorOccurredContent {
  type: string;
  error: string;
}

export interface LogContent {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface RequestWalletConnectionContent {
  hostname: string;
}

export interface RequestWalletSelectionContent {
  hostname: string;
  availableWallets: string[];
}

export interface RequestPassphraseContent {
  wallet: string;
}

export interface RequestPermissionsContent {
  hostname: string;
  wallet: string;
  permissions: Map<string, string>
}

export interface RequestTransactionSendingContent {
  hostname: string;
  wallet: string;
  publicKey: string;
  transaction: string;
  receivedAt: string;
}

export interface RequestTransactionSigningContent {
  hostname: string;
  wallet: string;
  publicKey: string;
  transaction: string;
  receivedAt: string;
}

export interface TransactionStatusContent {
  txHash: string;
  tx: string;
  error: string;
  sentAt: string;
}

export interface RequestSucceededContent {
}

// Received interaction events

export const enum INTERACTION_TYPE {
  REQUEST_WALLET_CONNECTION_REVIEW = 'REQUEST_WALLET_CONNECTION_REVIEW',
  REQUEST_WALLET_SELECTION = 'REQUEST_WALLET_SELECTION',
  REQUEST_SUCCEEDED = 'REQUEST_SUCCEEDED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  LOG = 'LOG',
}

export type RequestWalletConnection = {
  traceId: string;
  type: INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW;
  content: RequestWalletConnectionContent;
}

export type RequestWalletSelection = {
  traceId: string;
  type: INTERACTION_TYPE.REQUEST_WALLET_SELECTION,
  content: RequestWalletSelectionContent,
}

export type RequestSucceeded = {
  traceId: string;
  type: INTERACTION_TYPE.REQUEST_SUCCEEDED,
  content: RequestSucceededContent,
}

export type ErrorOccured = {
  traceId: string;
  type: INTERACTION_TYPE.ERROR_OCCURRED,
  content: ErrorOccurredContent,
}

export type Log = {
  traceId: string;
  type: INTERACTION_TYPE.LOG,
  content: LogContent,
}

export type RawInteraction =
  | RequestWalletConnection
  | RequestWalletSelection
  | RequestSucceeded
  | ErrorOccured
  | Log

export type Interaction<T extends RawInteraction = RawInteraction> = {
  meta: {
    id: string
  }
  event: T
}

// Responses



export interface SelectedWallet {
  wallet: string;
  passphrase: string;
}

export interface EnteredPassphrase {
  passphrase: string;
}

export interface Decision {
  approved: boolean;
}
