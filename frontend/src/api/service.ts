import type { Config } from '../models/config'
import type { GetConsoleStateResponse } from '../models/console-state'
import type {
  CreateWalletRequest,
  CreateWalletResponse
} from '../models/create-wallet'
import type { ImportWalletRequest } from '../models/import-wallet'
import type { ListKeysRequest, ListKeysResponse } from '../models/list-keys'
import type { ListWalletsResponse } from '../models/list-wallets'
import type { LoadWalletsRequest } from '../models/load-wallets'
import { ImportWalletResponse } from '../models/import-wallet'
import { LoadWalletsResponse } from '../models/load-wallets'

export function ListKeys(request: ListKeysRequest): Promise<ListKeysResponse> {
  return window.backend.Handler.ListKeys(JSON.stringify(request))
}

export function CreateWallet(
  request: CreateWalletRequest
): Promise<CreateWalletResponse> {
  return window.backend.Handler.CreateWallet(JSON.stringify(request))
}

export function ImportWallet(
  request: ImportWalletRequest
): Promise<ImportWalletResponse> {
  return window.backend.Handler.ImportWallet(JSON.stringify(request))
}

export function LoadWallets(
  request: LoadWalletsRequest
): Promise<LoadWalletsResponse> {
  return window.backend.Handler.LoadWallets(JSON.stringify(request))
}

export function IsAppInitialised(): Promise<boolean> {
  return window.backend.Handler.IsAppInitialised()
}

export function ListWallets(): Promise<ListWalletsResponse> {
  return window.backend.Handler.ListWallets()
}

export function GetServiceConfig(): Promise<Config> {
  return window.backend.Handler.GetServiceConfig()
}

export function SaveServiceConfig(config: string): Promise<boolean> {
  return window.backend.Handler.SaveServiceConfig(config)
}

export function StartConsole(): Promise<boolean> {
  return window.backend.Handler.StartConsole()
}

export function GetConsoleState(): Promise<GetConsoleStateResponse> {
  return window.backend.Handler.GetConsoleState()
}

export function StopConsole(): Promise<boolean> {
  return window.backend.Handler.StopConsole()
}
