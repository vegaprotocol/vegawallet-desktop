import {Config} from "../models/config"

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
