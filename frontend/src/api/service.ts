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

export function ListKeys(request: ListKeysRequest): Promise<ListKeysResponse> {
  return Promise.resolve({
    Name: 'matt',
    KeyPairs: [
      {
        PublicKey: '0x000000000000000000000000000000000',
        PrivateKey: '',
        IsTainted: false,
        Meta: [],
        AlgorithmName: 'ed2115',
        AlgorithmVersion: 2
      },
      {
        PublicKey: '0x1111111111111111111111111111111111',
        PrivateKey: '',
        IsTainted: false,
        Meta: [],
        AlgorithmName: 'ed2115',
        AlgorithmVersion: 2
      },
      {
        PublicKey: '0x22222222222222222222222222222222222',
        PrivateKey: '',
        IsTainted: false,
        Meta: [],
        AlgorithmName: 'ed2115',
        AlgorithmVersion: 2
      }
    ]
  })
  // return window.backend.Handler.ListKeys(JSON.stringify(request))
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

export function GetNetworkConfig(name: string): Promise<Network> {
  return window.backend.Handler.GetNetworkConfig(name)
}

export function SaveNetworkConfig(config: string): Promise<boolean> {
  return window.backend.Handler.SaveNetworkConfig(config)
}

export function StartConsole(request: StartConsoleRequest): Promise<boolean> {
  return window.backend.Handler.StartConsole(JSON.stringify(request))
}

export function GetConsoleState(): Promise<GetConsoleStateResponse> {
  return window.backend.Handler.GetConsoleState()
}

export function StopConsole(): Promise<boolean> {
  return window.backend.Handler.StopConsole()
}
