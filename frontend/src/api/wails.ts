import type { Network } from '../models/network'
import type { GetConsoleStateResponse } from '../models/console-state'
import type { ListKeysResponse } from '../models/list-keys'
import type { ListWalletsResponse } from '../models/list-wallets'
import type { CreateWalletResponse } from '../models/create-wallet'
import { ImportWalletResponse } from '../models/import-wallet'
import { LoadWalletsResponse } from '../models/load-wallets'

interface Handler {
  ListKeys(request: string): Promise<ListKeysResponse>

  CreateWallet(request: string): Promise<CreateWalletResponse>

  ImportWallet(request: string): Promise<ImportWalletResponse>

  LoadWallets(request: string): Promise<LoadWalletsResponse>

  IsAppInitialised(): Promise<boolean>

  ListWallets(): Promise<ListWalletsResponse>

  GetNetworkConfig(name: string): Promise<Network>

  SaveNetworkConfig(jsonConfig: string): Promise<boolean>

  StartConsole(request: string): Promise<boolean>

  GetConsoleState(): Promise<GetConsoleStateResponse>

  StopConsole(): Promise<boolean>
}

interface Backend {
  Handler: Handler
}

declare global {
  interface Window {
    backend: Backend
  }
}
