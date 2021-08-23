import {Config} from "../models/config";
import {ListWalletsResponse} from "../models/list-wallets";

interface Service {
  LoadWallets(request: string): Promise<boolean>

  IsAppInitialised(): Promise<boolean>

  ListWallets(): Promise<ListWalletsResponse>

  GetConfig(): Promise<Config>

  SaveConfig(jsonConfig: string): Promise<boolean>

  StartConsole(): Promise<boolean>

  StopConsole(): Promise<boolean>
}

interface Backend {
  Service: Service
}

declare global {
  interface Window {
    backend: Backend;
  }
}
