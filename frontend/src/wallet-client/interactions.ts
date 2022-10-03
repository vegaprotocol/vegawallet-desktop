export const enum INTERACTION {
  REQUEST_WALLET_CONNECTION_REVIEW = 'REQUEST_WALLET_CONNECTION_REVIEW',
  REQUEST_WALLET_SELECTION = 'REQUEST_WALLET_SELECTION',
}

export type RequestWalletConnection = {
  traceId: string;
  type: INTERACTION.REQUEST_WALLET_CONNECTION_REVIEW;
  content: RequestWalletConnectionReview;
}

export type RequestWalletSelection = {
  traceId: string;
  type: INTERACTION.REQUEST_WALLET_SELECTION,
  content: RequestWalletSelectionReview,
}

export type Interaction = RequestWalletConnection | RequestWalletSelection

// Received interactions.

export interface ErrorOccurred {
  type: string;
  error: string;
}

export interface Log {
  type: string;
  message: string;
}

export interface RequestWalletConnectionReview {
  hostname: string;
}

export interface RequestWalletSelectionReview {
  hostname: string;
  availableWallets: string[];
}

export interface RequestPassphrase {
  wallet: string;
}

export interface RequestPermissionsReview {
  hostname: string;
  wallet: string;
  permissions: Map<string, string>
}

export interface RequestTransactionSendingReview {
  hostname: string;
  wallet: string;
  publicKey: string;
  transaction: string;
  receivedAt: string;
}

export interface RequestTransactionSigningReview {
  hostname: string;
  wallet: string;
  publicKey: string;
  transaction: string;
  receivedAt: string;
}

export interface TransactionStatus {
  txHash: string;
  tx: string;
  error: string;
  sentAt: string;
}

export interface RequestSucceeded {
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
