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

export function ListKeys(request: ListKeysRequest): Promise<ListKeysResponse> {
  return window.backend.Service.ListKeys(JSON.stringify(request))
}

export function CreateWallet(
  request: CreateWalletRequest
): Promise<CreateWalletResponse> {
  return window.backend.Service.CreateWallet(JSON.stringify(request))
}

export function ImportWallet(request: ImportWalletRequest): Promise<boolean> {
  return window.backend.Service.ImportWallet(JSON.stringify(request))
}

export function LoadWallets(request: LoadWalletsRequest): Promise<boolean> {
  return window.backend.Service.LoadWallets(JSON.stringify(request))
}

export function IsAppInitialised(): Promise<boolean> {
  return window.backend.Service.IsAppInitialised()
}

export function ListWallets(): Promise<ListWalletsResponse> {
  return window.backend.Service.ListWallets()
}

export function GetServiceConfig(): Promise<Config> {
  return window.backend.Service.GetServiceConfig()
}

export function SaveServiceConfig(config: string): Promise<boolean> {
  return window.backend.Service.SaveServiceConfig(config)
}

export function StartConsole(): Promise<boolean> {
  return window.backend.Service.StartConsole()
}

export function GetConsoleState(): Promise<GetConsoleStateResponse> {
  return window.backend.Service.GetConsoleState()
}

export function StopConsole(): Promise<boolean> {
  return window.backend.Service.StopConsole()
}
