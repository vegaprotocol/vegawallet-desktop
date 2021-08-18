import {Config} from "../models/config"
import {LoadWalletsRequest} from "../models/load-wallets";
import {ListWalletsResponse} from "../models/list-wallets";

export function LoadWallets(request: LoadWalletsRequest): Promise<boolean> {
    return window.backend.Service.LoadWallets(JSON.stringify(request));
}

export function IsAppInitialised(): Promise<boolean> {
    return window.backend.Service.IsAppInitialised();
}

export function ListWallets(): Promise<ListWalletsResponse> {
    return window.backend.Service.ListWallets();
}

export function GetConfig(): Promise<Config> {
    return window.backend.Service.GetConfig();
}

export function SaveConfig(config: string): Promise<boolean> {
    return window.backend.Service.SaveConfig(config)
}

export function StartConsole(): Promise<boolean> {
    return window.backend.Service.StartConsole()
}

export function StopConsole(): Promise<boolean> {
    return window.backend.Service.StopConsole()
}
