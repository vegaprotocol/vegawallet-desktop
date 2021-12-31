import type { ImportNetworkResponse, Network } from '../models/network'
import { ImportNetworkRequest, ListNetworksResponse } from '../models/network'
import type { GetServiceStateResponse } from '../models/console-state'
import type { ListKeysResponse } from '../models/keys'
import {
  DescribeKeyResponse,
  GenerateKeyResponse,
  IsolateKeyResponse
} from '../models/keys'
import type { ListWalletsResponse } from '../models/list-wallets'
import type { CreateWalletResponse } from '../models/create-wallet'
import { ImportWalletResponse } from '../models/import-wallet'
import { GetVersionResponse } from '../models/version'

interface Handler {
  GetVersion(): Promise<GetVersionResponse>

  GenerateKey(request: string): Promise<GenerateKeyResponse>

  DescribeKey(request: string): Promise<DescribeKeyResponse>

  AnnotateKey(request: string): Promise<void>

  TaintKey(request: string): Promise<void>

  UntaintKey(request: string): Promise<void>

  IsolateKey(request: string): Promise<IsolateKeyResponse>

  ListKeys(request: string): Promise<ListKeysResponse>

  CreateWallet(request: string): Promise<CreateWalletResponse>

  ImportWallet(request: string): Promise<ImportWalletResponse>

  IsAppInitialised(): Promise<boolean>

  InitialiseApp(request: string): Promise<void>

  ListWallets(): Promise<ListWalletsResponse>

  ImportNetwork(request: string): Promise<ImportNetworkResponse>

  GetNetworkConfig(name: string): Promise<Network>

  ListNetworks(): Promise<ListNetworksResponse>

  SaveNetworkConfig(jsonConfig: string): Promise<boolean>

  StartService(request: string): Promise<boolean>

  GetServiceState(): Promise<GetServiceStateResponse>

  StopService(): Promise<boolean>
}

interface Backend {
  Handler: Handler
}

declare global {
  interface Window {
    backend: Backend
  }
}
