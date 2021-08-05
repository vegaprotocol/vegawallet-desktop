import {Config} from "../models/config";

interface Service {
    GetConfig(): Promise<Config>
}

interface Backend {
    Service: Service
}

declare global {
    interface Window {
        backend: Backend;
    }
}
