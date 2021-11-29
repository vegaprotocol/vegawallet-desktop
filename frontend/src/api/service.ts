import type { Network } from '../models/network'
import type { GetConsoleStateResponse } from '../models/console-state'
import type {
  CreateWalletRequest,
  CreateWalletResponse
} from '../models/create-wallet'
import type { ImportWalletRequest } from '../models/import-wallet'
import { ImportWalletResponse } from '../models/import-wallet'
import type { ListKeysRequest, ListKeysResponse } from '../models/list-keys'
import type { ListWalletsResponse } from '../models/list-wallets'
import type { LoadWalletsRequest } from '../models/load-wallets'
import { LoadWalletsResponse } from '../models/load-wallets'
import { StartConsoleRequest } from '../models/start-console'

/**
 * Lists all key pairs for a given wallet. Requires your wallet name and passphrase
 */
export function ListKeys(request: ListKeysRequest): Promise<ListKeysResponse> {
  return window.backend.Handler.ListKeys(JSON.stringify(request))
}

/**
 *  Creates a new wallet
 */
export function CreateWallet(
  request: CreateWalletRequest
): Promise<CreateWalletResponse> {
  return window.backend.Handler.CreateWallet(JSON.stringify(request))
}

/**
 * Imports a wallet using a mnemonic phrase
 */
export function ImportWallet(
  request: ImportWalletRequest
): Promise<ImportWalletResponse> {
  return window.backend.Handler.ImportWallet(JSON.stringify(request))
}

/**
 * Loads a wallet by specifying a path to an existing wallet on your machine
 */
export function LoadWallets(
  request: LoadWalletsRequest
): Promise<LoadWalletsResponse> {
  return window.backend.Handler.LoadWallets(JSON.stringify(request))
}

/**
 * TODO: Find out what this does exactly
 */
export function IsAppInitialised(): Promise<boolean> {
  return window.backend.Handler.IsAppInitialised()
}

/**
 * Lists all wallets
 */
export function ListWallets(): Promise<ListWalletsResponse> {
  return window.backend.Handler.ListWallets()
}

/**
 * Gets the config of a given wallet
 */
export function GetNetworkConfig(name: string): Promise<Network> {
  return window.backend.Handler.GetNetworkConfig(name)
}

/**
 * Saves config changes
 */
export function SaveNetworkConfig(config: string): Promise<boolean> {
  return window.backend.Handler.SaveNetworkConfig(config)
}

/**
 * Starts the console proxy
 */
export function StartConsole(request: StartConsoleRequest): Promise<boolean> {
  return window.backend.Handler.StartConsole(JSON.stringify(request))
}

/**
 * Returns the current console url and whether or not its running via the desktop wallet
 */
export function GetConsoleState(): Promise<GetConsoleStateResponse> {
  return window.backend.Handler.GetConsoleState()
}

/**
 * Stops the console proxy
 */
export function StopConsole(): Promise<boolean> {
  return window.backend.Handler.StopConsole()
}
