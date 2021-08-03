import {Config} from "../models/config";

interface Service {
    GetConfig(): Promise<Config>
    SaveConfig(jsonConfig: string): Promise<boolean>
}

interface Backend {
    Service: Service
}

declare global {
    interface Window {
        backend: Backend;
    }
}
