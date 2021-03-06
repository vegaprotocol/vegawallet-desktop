import type {
  AnnotateKeyRequest,
  CheckVersionResponse,
  ClearSentTransactionRequest,
  Config,
  ConsentRequest,
  ConsentToTransactionRequest,
  CreateWalletRequest,
  CreateWalletResponse,
  DeleteWalletRequest,
  DescribeKeyRequest,
  DescribeKeyResponse,
  GenerateKeyRequest,
  GenerateKeyResponse,
  GetConsentRequestRequest,
  GetServiceStateResponse,
  GetVersionResponse,
  ImportNetworkFromSourceRequest,
  ImportNetworkFromSourceResponse,
  ImportWalletRequest,
  ImportWalletResponse,
  InitialiseAppRequest,
  IsolateKeyRequest,
  IsolateKeyResponse,
  ListConsentRequestsResponse,
  ListKeysRequest,
  ListKeysResponse,
  ListNetworksResponse,
  ListSentTransactionsResponse,
  ListWalletsResponse,
  Network,
  SearchForExistingConfigurationResponse,
  SignMessageRequest,
  SignMessageResponse,
  StartServiceRequest,
  TaintKeyRequest,
  UntaintKeyRequest
} from '../wailsjs/go/models'
import type { runtime } from '../wailsjs/runtime/runtime'

export interface Handler {
  AnnotateKey(arg1: AnnotateKeyRequest): Promise<void>
  CheckVersion(): Promise<CheckVersionResponse>
  CreateWallet(arg1: CreateWalletRequest): Promise<CreateWalletResponse>
  DescribeKey(arg1: DescribeKeyRequest): Promise<DescribeKeyResponse>
  GenerateKey(arg1: GenerateKeyRequest): Promise<GenerateKeyResponse>
  GetAppConfig(): Promise<Config>
  GetNetworkConfig(arg1: string): Promise<Network>
  GetServiceState(): Promise<GetServiceStateResponse>
  GetConsoleState(): Promise<GetServiceStateResponse>
  GetTokenDAppState(): Promise<GetServiceStateResponse>
  GetVersion(): Promise<GetVersionResponse>
  ImportNetwork(
    arg1: ImportNetworkFromSourceRequest
  ): Promise<ImportNetworkFromSourceResponse>
  ImportWallet(arg1: ImportWalletRequest): Promise<ImportWalletResponse>
  InitialiseApp(arg1: InitialiseAppRequest): Promise<void>
  IsAppInitialised(): Promise<boolean>
  IsolateKey(arg1: IsolateKeyRequest): Promise<IsolateKeyResponse>
  ListKeys(arg1: ListKeysRequest): Promise<ListKeysResponse>
  ListNetworks(): Promise<ListNetworksResponse>
  ListWallets(): Promise<ListWalletsResponse>
  SaveAppConfig(arg1: Config): Promise<void>
  SaveNetworkConfig(arg1: Network): Promise<boolean>
  StartService(arg1: StartServiceRequest): Promise<boolean>
  StopService(): Promise<boolean>
  TaintKey(arg1: TaintKeyRequest): Promise<void>
  UntaintKey(arg1: UntaintKeyRequest): Promise<void>
  UpdateAppConfig(arg1: Config): Promise<void>
  SearchForExistingConfiguration(): Promise<SearchForExistingConfigurationResponse>
  StartConsole(arg1: StartServiceRequest): Promise<boolean>
  StartTokenDApp(arg1: StartServiceRequest): Promise<boolean>
  StopService(): Promise<boolean>
  StopConsole(): Promise<boolean>
  StopTokenDApp(): Promise<boolean>
  SignMessage(arg1: SignMessageRequest): Promise<SignMessageResponse>
  DeleteWallet(arg1: DeleteWalletRequest): Promise<void>
  GetConsentRequest(arg1: GetConsentRequestRequest): Promise<ConsentRequest>
  ListConsentRequests(): Promise<ListConsentRequestsResponse>
  ConsentToTransaction(arg1: ConsentToTransactionRequest): Promise<void>
  ListSentTransactions(): Promise<ListSentTransactionsResponse>
  ClearSentTransaction(arg1: ClearSentTransactionRequest): Promise<void>
}

// Add Wails backend handler and runtime to window object
declare global {
  interface Window {
    go: {
      backend: {
        Handler: Handler
      }
    }
    runtime: runtime
  }
}
