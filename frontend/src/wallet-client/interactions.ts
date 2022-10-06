export const enum INTERACTION {
  REQUEST_WALLET_CONNECTION_REVIEW = 'REQUEST_WALLET_CONNECTION_REVIEW',
  REQUEST_WALLET_SELECTION = 'REQUEST_WALLET_SELECTION',
  REQUEST_PASSPHRASE = 'REQUEST_PASSPHRASE',
  REQUEST_PERMISSIONS_REVIEW = 'REQUEST_PERMISSIONS_REVIEW',
  REQUEST_TRANSACTION_REVIEW_FOR_SENDING = 'REQUEST_TRANSACTION_REVIEW_FOR_SENDING',
  REQUEST_TRANSACTION_REVIEW_FOR_SIGNING = 'REQUEST_TRANSACTION_REVIEW_FOR_SIGNING',
  REQUEST_SUCCEEDED = 'REQUEST_SUCCEEDED',
  INTERACTION_SESSION_BEGAN = 'INTERACTION_SESSION_BEGAN',
  INTERACTION_SESSION_ENDED = 'INTERACTION_SESSION_ENDED',
  TRANSACTION_SUCCEEDED = 'TRANSACTION_SUCCEEDED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  LOG = 'LOG',
  SELECTED_WALLET = 'SELECTED_WALLET',
  WALLET_CONNECTION_DECISION = 'WALLET_CONNECTION_DECISION',
  DECISION = 'DECISION',
  ENTERED_PASSPHRASE = 'ENTERED_PASSPHRASE',
}

export type RequestWalletConnectionReview = {
  traceId: string;
  type: INTERACTION.REQUEST_WALLET_CONNECTION_REVIEW;
  content: RequestWalletConnectionReviewContent;
}

export type RequestWalletSelection = {
  traceId: string;
  type: INTERACTION.REQUEST_WALLET_SELECTION,
  content: RequestWalletSelectionContent,
}

export type RequestPassphrase = {
  traceId: string;
  type: INTERACTION.REQUEST_PASSPHRASE,
  content: RequestPassphraseContent
}

export type RequestPermissionsReview = {
  traceId: string;
  type: INTERACTION.REQUEST_PERMISSIONS_REVIEW,
  content: RequestPermissionsReviewContent
}

export type RequestTransactionReviewForSending = {
  traceId: string;
  type: INTERACTION.REQUEST_TRANSACTION_REVIEW_FOR_SENDING,
  content: RequestTransactionReviewForSendingContent
}

export type RequestTransactionReviewForSigning = {
  traceId: string;
  type: INTERACTION.REQUEST_TRANSACTION_REVIEW_FOR_SIGNING,
  content: RequestTransactionReviewForSigningContent
}

export type InteractionSessionStarted = {
  traceId: string;
  type: INTERACTION.INTERACTION_SESSION_BEGAN,
  content: InteractionSessionBeganContent
}

export type InteractionSessionEnded = {
  traceId: string;
  type: INTERACTION.INTERACTION_SESSION_ENDED,
  content: InteractionSessionEndedContent
}

export type RequestSucceeded = {
  traceId: string;
  type: INTERACTION.REQUEST_SUCCEEDED,
  content: RequestSucceededContent
}

export type TransactionFailed = {
  traceId: string;
  type: INTERACTION.TRANSACTION_FAILED,
  content: TransactionFailedContent
}

export type TransactionSucceeded = {
  traceId: string;
  type: INTERACTION.TRANSACTION_SUCCEEDED,
  content: TransactionSucceededContent
}

export type ErrorOccurred = {
  traceId: string;
  type: INTERACTION.ERROR_OCCURRED,
  content: ErrorOccurredContent
}

export type Log = {
  traceId: string;
  type: INTERACTION.LOG,
  content: LogContent
}

export type SelectedWallet = {
  traceId: string;
  type: INTERACTION.SELECTED_WALLET,
  content: SelectedWalletContent
}

export type EnteredPassphrase = {
  traceId: string;
  type: INTERACTION.ENTERED_PASSPHRASE,
  content: EnteredPassphraseContent
}

export type WalletConnectionDecision = {
  traceId: string;
  type: INTERACTION.WALLET_CONNECTION_DECISION,
  content: WalletConnectionDecisionContent
}

export type Decision = {
  traceId: string;
  type: INTERACTION.DECISION,
  content: DecisionContent
}

export type Interaction =
  RequestWalletConnectionReview
  | RequestWalletSelection
  | RequestPassphrase
  | RequestPermissionsReview
  | RequestTransactionReviewForSending
  | RequestTransactionReviewForSigning
  | InteractionSessionStarted
  | InteractionSessionEnded
  | RequestSucceeded
  | TransactionFailed
  | TransactionSucceeded
  | ErrorOccurred
  | Log
  | SelectedWallet
  | EnteredPassphrase
  | WalletConnectionDecision
  | Decision

// Requests.

export interface RequestWalletConnectionReviewContent {
  hostname: string;
}

export interface RequestWalletSelectionContent {
  hostname: string;
  availableWallets: string[];
}

export interface RequestPassphraseContent {
  wallet: string;
}

export interface RequestPermissionsReviewContent {
  hostname: string;
  wallet: string;
  permissions: Map<string, string>
}

export interface RequestTransactionReviewForSendingContent {
  hostname: string;
  wallet: string;
  publicKey: string;
  transaction: string;
  receivedAt: string;
}

export interface RequestTransactionReviewForSigningContent {
  hostname: string;
  wallet: string;
  publicKey: string;
  transaction: string;
  receivedAt: string;
}

// Notifications.

export interface InteractionSessionBeganContent {
}

export interface InteractionSessionEndedContent {
}

export interface RequestSucceededContent {
}

export interface TransactionFailedContent {
  deserializedInputData: string;
  tx: string;
  error: string;
  sentAt: string;
}

export interface TransactionSucceededContent {
  deserializedInputData: string;
  txHash: string;
  tx: string;
  sentAt: string;
}

export interface ErrorOccurredContent {
  type: string;
  error: string;
}

export interface LogContent {
  type: string;
  message: string;
}

// Responses.

export interface SelectedWalletContent {
  wallet: string;
  passphrase: string;
}

export interface EnteredPassphraseContent {
  passphrase: string;
}

export interface WalletConnectionDecisionContent {
  connectionApproval: string;
}

export interface DecisionContent {
  approved: boolean;
}
