import {Config} from "../models/config"

export function GetConfig(): Promise<Config> {
    return window.backend.Service.GetConfig();
}

export function SaveConfig(config: string): Promise<boolean> {
    return window.backend.Service.SaveConfig(config)
}
