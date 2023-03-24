import {backend, wallet, config, network} from '../wailsjs/go/models'

export interface Handler {
  AnnotateKey(arg1: wallet.AnnotateKeyRequest): Promise<void>
  CheckVersion(): Promise<backend.CheckVersionResponse>
  CreateWallet(arg1: wallet.CreateWalletRequest): Promise<wallet.CreateWalletResponse>
  DescribeKey(arg1: wallet.DescribeKeyRequest): Promise<wallet.DescribeKeyResponse>
  GenerateKey(arg1: wallet.GenerateKeyRequest): Promise<wallet.GenerateKeyResponse>
  GetAppConfig(): Promise<config.Config>
  GetNetworkConfig(arg1: string): Promise<network.Network>
  GetServiceState(): Promise<backend.GetServiceStateResponse>
  GetConsoleState(): Promise<backend.GetServiceStateResponse>
  GetTokenDAppState(): Promise<backend.GetServiceStateResponse>
  GetVersion(): Promise<backend.GetVersionResponse>
  ImportNetwork(
    arg1: network.ImportNetworkFromSourceRequest
  ): Promise<network.ImportNetworkFromSourceResponse>
  ImportWallet(arg1: wallet.ImportWalletRequest): Promise<wallet.ImportWalletResponse>
  InitialiseApp(arg1: backend.InitialiseAppRequest): Promise<void>
  IsAppInitialised(): Promise<boolean>
  IsolateKey(arg1: wallet.IsolateKeyRequest): Promise<wallet.IsolateKeyResponse>
  ListKeys(arg1: wallet.ListKeysRequest): Promise<wallet.ListKeysResponse>
  ListNetworks(): Promise<network.ListNetworksResponse>
  ListWallets(): Promise<wallet.ListWalletsResponse>
  SaveAppConfig(arg1: config.Config): Promise<void>
  SaveNetworkConfig(arg1: network.Network): Promise<boolean>
  StartService(arg1: backend.StartServiceRequest): Promise<boolean>
  StopService(): Promise<boolean>
  TaintKey(arg1: wallet.TaintKeyRequest): Promise<void>
  UntaintKey(arg1: wallet.UntaintKeyRequest): Promise<void>
  UpdateAppConfig(arg1: Partial<config.Config>): Promise<void>
  SearchForExistingConfiguration(): Promise<backend.SearchForExistingConfigurationResponse>
  StartConsole(arg1: backend.StartServiceRequest): Promise<boolean>
  StartTokenDApp(arg1: backend.StartServiceRequest): Promise<boolean>
  StopService(): Promise<boolean>
  StopConsole(): Promise<boolean>
  StopTokenDApp(): Promise<boolean>
  SignMessage(arg1: wallet.SignMessageRequest): Promise<wallet.SignMessageResponse>
  DeleteWallet(arg1: backend.DeleteWalletRequest): Promise<void>
  GetConsentRequest(arg1: backend.GetConsentRequestRequest): Promise<backend.ConsentRequest>
  ListConsentRequests(): Promise<backend.ListConsentRequestsResponse>
  ConsentToTransaction(arg1: backend.ConsentToTransactionRequest): Promise<void>
  ListSentTransactions(): Promise<backend.ListSentTransactionsResponse>
  ClearSentTransaction(arg1: backend.ClearSentTransactionRequest): Promise<void>
}

// Add Wails backend handler and runtime to window object
declare global {
  interface Window {
    go: {
      backend: {
        Handler: Handler
      }
    },
  }
}
