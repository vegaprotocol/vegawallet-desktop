import type { Dispatch, SetStateAction } from 'react'

export const enum EVENT_FLOW_TYPE {
  WALLET_CONNECTION = 'WALLET_CONNECTION',
  TRANSACTION_REVIEW = 'TRANSACTION_REVIEW',
  PERMISSION_REQUEST = 'PERMISSION_REQUEST'
}

export type InteractionContentProps<T extends RawInteraction> =
  {
    event: T
    history: Interaction[]
    flow?: EVENT_FLOW_TYPE
    isResolved: boolean
    setResolved: Dispatch<SetStateAction<boolean>>
    onFinish: () => void
  }

// Received interaction content

export interface ErrorOccurredContent {
  name: string
  error: string
}

export interface LogContent {
  type: 'Info' | 'Warning' | 'Error' | 'Success'
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

export const enum PermissionTarget {
  PUBLIC_KEYS = 'public_keys'
}

export const enum PermissionType {
  READ = 'read'
}

export interface RequestPermissionsContent {
  hostname: string
  wallet: string
  permissions: Record<PermissionTarget, PermissionType>
}

export interface RequestTransactionReviewContent {
  hostname: string
  wallet: string
  publicKey: string
  transaction: string
  receivedAt: string
}

export interface RequestTransactionSuccessContent {
  txHash: string
  tx: string
  deserializedInputData: string
  sentAt: string
}

export interface RequestTransactionFailureContent {
  tx: string
  deserializedInputData: string
  error: string
  sentAt: string
}

export interface RequestTransactionSigningContent {
  hostname: string
  wallet: string
  publicKey: string
  transaction: string
  receivedAt: string
}

export interface RequestSucceededContent {
  message: string
}

// Received interaction events

export const enum INTERACTION_TYPE {
  INTERACTION_SESSION_BEGAN = 'INTERACTION_SESSION_BEGAN',
  INTERACTION_SESSION_ENDED = 'INTERACTION_SESSION_ENDED',
  REQUEST_WALLET_CONNECTION_REVIEW = 'REQUEST_WALLET_CONNECTION_REVIEW',
  REQUEST_WALLET_SELECTION = 'REQUEST_WALLET_SELECTION',
  REQUEST_PERMISSIONS_REVIEW = 'REQUEST_PERMISSIONS_REVIEW',
  REQUEST_TRANSACTION_REVIEW_FOR_SENDING = 'REQUEST_TRANSACTION_REVIEW_FOR_SENDING',
  TRANSACTION_SUCCEEDED = 'TRANSACTION_SUCCEEDED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  REQUEST_PASSPHRASE = 'REQUEST_PASSPHRASE',
  REQUEST_SUCCEEDED = 'REQUEST_SUCCEEDED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  LOG = 'LOG'
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

export type RequestPermissions = {
  traceID: string
  name: INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW
  data: RequestPermissionsContent
}

export type RequestTransactionReview = {
  traceID: string
  name: INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING
  data: RequestTransactionReviewContent
}

export type RequestTransactionSuccess = {
  traceID: string
  name: INTERACTION_TYPE.TRANSACTION_SUCCEEDED
  data: RequestTransactionSuccessContent
}

export type RequestTransactionFailure = {
  traceID: string
  name: INTERACTION_TYPE.TRANSACTION_FAILED
  data: RequestTransactionFailureContent
}

export type RequestPassphrase = {
  traceID: string
  name: INTERACTION_TYPE.REQUEST_PASSPHRASE
  data: RequestPassphraseContent
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
  | RequestPermissions
  | RequestTransactionReview
  | RequestTransactionSuccess
  | RequestTransactionFailure
  | RequestPassphrase
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
  CANCEL_REQUEST = 'CANCEL_REQUEST',
  DECISION = 'DECISION',
  ENTERED_PASSPHRASE = 'ENTERED_PASSPHRASE',
  WALLET_CONNECTION_DECISION = 'WALLET_CONNECTION_DECISION',
  SELECTED_WALLET = 'SELECTED_WALLET'
}

// response data types

export interface EnteredPassphrase {
  passphrase: string
}

export const enum CONNECTION_RESPONSE {
  APPROVED_ONCE = 'APPROVED_ONLY_THIS_TIME',
  REJECTED_ONCE = 'REJECTED_ONLY_THIS_TIME'
}
export interface WalletConnectionDecision {
  connectionApproval: CONNECTION_RESPONSE
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
