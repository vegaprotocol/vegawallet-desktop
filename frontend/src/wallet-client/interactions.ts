export interface Interaction {
  traceId: string;
  type: string;
  content: any;
}

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

export interface RequestWalletSelection {
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
