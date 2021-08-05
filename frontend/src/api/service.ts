import {Config} from "../models/config"

export function GetConfig(): Promise<Config> {
    return window.backend.Service.GetConfig();
}

