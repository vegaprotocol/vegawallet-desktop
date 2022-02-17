import type {
  AnnotateKeyRequest,
  CheckVersionResponse,
  Config,
  CreateWalletRequest,
  CreateWalletResponse,
  DescribeKeyRequest,
  DescribeKeyResponse,
  GenerateKeyRequest,
  GenerateKeyResponse,
  GetServiceStateResponse,
  GetVersionResponse,
  ImportNetworkFromSourceRequest,
  ImportNetworkFromSourceResponse,
  ImportWalletRequest,
  ImportWalletResponse,
  IsolateKeyRequest,
  IsolateKeyResponse,
  ListKeysRequest,
  ListKeysResponse,
  ListNetworksResponse,
  ListWalletsResponse,
  Network,
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
  GetNetworkConfig(arg1: string): Promise<Network>
  GetServiceState(): Promise<GetServiceStateResponse>
  GetVersion(): Promise<GetVersionResponse>
  ImportNetwork(
    arg1: ImportNetworkFromSourceRequest
  ): Promise<ImportNetworkFromSourceResponse>
  ImportWallet(arg1: ImportWalletRequest): Promise<ImportWalletResponse>
  InitialiseApp(arg1: Config): Promise<void>
  IsAppInitialised(): Promise<boolean>
  IsolateKey(arg1: IsolateKeyRequest): Promise<IsolateKeyResponse>
  ListKeys(arg1: ListKeysRequest): Promise<ListKeysResponse>
  ListNetworks(): Promise<ListNetworksResponse>
  ListWallets(): Promise<ListWalletsResponse>
  SaveNetworkConfig(arg1: Network): Promise<boolean>
  StartService(arg1: StartServiceRequest): Promise<boolean>
  StopService(): Promise<boolean>
  TaintKey(arg1: TaintKeyRequest): Promise<void>
  UntaintKey(arg1: UntaintKeyRequest): Promise<void>
  SignMessage(arg1: SignMessageRequest): Promise<SignMessageResponse | Error>
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
