import type {Network} from '../models/network'
import {ListNetworksResponse} from "../models/network";
import type {GetServiceStateResponse} from '../models/console-state'
import type {ListKeysResponse} from '../models/keys'
import {DescribeKeyResponse, GenerateKeyResponse, IsolateKeyResponse} from "../models/keys";
import type {ListWalletsResponse} from '../models/list-wallets'
import type {CreateWalletResponse} from '../models/create-wallet'
import {ImportWalletResponse} from '../models/import-wallet'
import {LoadWalletsResponse} from '../models/load-wallets'

interface Handler {
  GenerateKey(request: string): Promise<GenerateKeyResponse>

  DescribeKey(request: string): Promise<DescribeKeyResponse>

  AnnotateKey(request: string): Promise<void>

  TaintKey(request: string): Promise<void>

  UntaintKey(request: string): Promise<void>

  IsolateKey(request: string): Promise<IsolateKeyResponse>

  ListKeys(request: string): Promise<ListKeysResponse>

  CreateWallet(request: string): Promise<CreateWalletResponse>

  ImportWallet(request: string): Promise<ImportWalletResponse>

  LoadWallets(request: string): Promise<LoadWalletsResponse>

  IsAppInitialised(): Promise<boolean>

  ListWallets(): Promise<ListWalletsResponse>

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
