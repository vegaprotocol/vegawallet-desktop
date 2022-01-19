import type {
  ImportNetworkRequest,
  ImportNetworkResponse,
  ListNetworksResponse,
  Network,
  SaveNetworkConfigRequest
} from '../models/network'
import type { GetServiceStateResponse } from '../models/console-state'
import type {
  CreateWalletRequest,
  CreateWalletResponse
} from '../models/create-wallet'
import type { ImportWalletRequest } from '../models/import-wallet'
import { ImportWalletResponse } from '../models/import-wallet'
import type {
  GenerateKeyRequest,
  DescribeKeyRequest,
  AnnotateKeyRequest,
  IsolateKeyRequest,
  TaintKeyRequest,
  UntaintKeyRequest,
  ListKeysRequest,
  ListKeysResponse
} from '../models/keys'
import {
  DescribeKeyResponse,
  GenerateKeyResponse,
  IsolateKeyResponse
} from '../models/keys'
import type { ListWalletsResponse } from '../models/list-wallets'
import { StartServiceRequest } from '../models/start-console'
import { GetVersionResponse } from '../models/version'
import { AppConfig } from '../models/app-config'
import { Service } from '../app'

/**
 * Return the software version.
 */
function GetVersion(): Promise<GetVersionResponse> {
  return window.backend.Handler.GetVersion()
}

/**
 * Generate a new key on a given wallet. If the wallet doesn't exist, it's
 * created.
 */
function GenerateKey(
  request: GenerateKeyRequest
): Promise<GenerateKeyResponse> {
  return window.backend.Handler.GenerateKey(JSON.stringify(request))
}

/**
 * Get all information of given key (no private key)
 */
function DescribeKey(
  request: DescribeKeyRequest
): Promise<DescribeKeyResponse> {
  return window.backend.Handler.DescribeKey(JSON.stringify(request))
}

/**
 * Add metadata to a key pair.
 */
function AnnotateKey(request: AnnotateKeyRequest): Promise<void> {
  return window.backend.Handler.AnnotateKey(JSON.stringify(request))
}

/**
 * Mark a key pair as unsafe to use.
 */
function TaintKey(request: TaintKeyRequest): Promise<void> {
  return window.backend.Handler.TaintKey(JSON.stringify(request))
}

/**
 * Remove the taint of a key pair.
 */
function UntaintKey(request: UntaintKeyRequest): Promise<void> {
  return window.backend.Handler.UntaintKey(JSON.stringify(request))
}

/**
 * Isolate the given key pair in a wallet stripped form its generation mechanism
 * and siblings.
 */
function IsolateKey(request: IsolateKeyRequest): Promise<IsolateKeyResponse> {
  return window.backend.Handler.IsolateKey(JSON.stringify(request))
}

/**
 * Lists all key pairs for a given wallet. Requires your wallet name and passphrase
 */
function ListKeys(request: ListKeysRequest): Promise<ListKeysResponse> {
  return window.backend.Handler.ListKeys(JSON.stringify(request))
}

/**
 *  Creates a new wallet
 */
function CreateWallet(
  request: CreateWalletRequest
): Promise<CreateWalletResponse> {
  return window.backend.Handler.CreateWallet(JSON.stringify(request))
}

/**
 * Imports a wallet using a recovery phrase
 */
function ImportWallet(
  request: ImportWalletRequest
): Promise<ImportWalletResponse> {
  // @ts-ignore
  return window.backend.Handler.ImportWallet(request)
}

/**
 * Verify the application has a configuration file initialised with a defined
 * Vega home.
 */
function IsAppInitialised(): Promise<boolean> {
  return window.backend.Handler.IsAppInitialised()
}

/**
 * Verify the application has a configuration file initialised with a defined
 * Vega home.
 */
function InitialiseApp(request: AppConfig): Promise<void> {
  return window.backend.Handler.InitialiseApp(JSON.stringify(request))
}

/**
 * Lists all wallets
 */
function ListWallets(): Promise<ListWalletsResponse> {
  return window.backend.Handler.ListWallets()
}

/**
 * Gets the config of a given network
 */
function ImportNetwork(
  request: ImportNetworkRequest
): Promise<ImportNetworkResponse> {
  return window.backend.Handler.ImportNetwork(JSON.stringify(request))
}

/**
 * Gets the config of a given network
 */
function GetNetworkConfig(name: string): Promise<Network> {
  return window.backend.Handler.GetNetworkConfig(name)
}

/**
 * List all registered networks
 */
function ListNetworks(): Promise<ListNetworksResponse> {
  return window.backend.Handler.ListNetworks()
}

/**
 * Saves config changes
 */
function SaveNetworkConfig(
  request: SaveNetworkConfigRequest
): Promise<boolean> {
  return window.backend.Handler.SaveNetworkConfig(JSON.stringify(request))
}

/**
 * Starts the service
 */
function StartService(request: StartServiceRequest): Promise<boolean> {
  return window.backend.Handler.StartService(JSON.stringify(request))
}

/**
 * Returns the current service state, the console URL and whether or not its
 * running via the desktop wallet
 */
function GetServiceState(): Promise<GetServiceStateResponse> {
  return window.backend.Handler.GetServiceState()
}

/**
 * Stops the service
 */
function StopService(): Promise<boolean> {
  return window.backend.Handler.StopService()
}

export const service: Service = {
  GetVersion,
  GenerateKey,
  DescribeKey,
  AnnotateKey,
  TaintKey,
  UntaintKey,
  IsolateKey,
  ListKeys,
  CreateWallet,
  ImportWallet,
  IsAppInitialised,
  InitialiseApp,
  ListWallets,
  ImportNetwork,
  GetNetworkConfig,
  ListNetworks,
  SaveNetworkConfig,
  StartService,
  GetServiceState,
  StopService
}
