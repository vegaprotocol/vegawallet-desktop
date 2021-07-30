export class ConsoleConfig {
    URL: string = ""
    LocalPort: number = 0
}

export class NodesConfig {
    Hosts: string[] = []
    Retries: number = 0
}

export class Config {
    Level: string = ""
    TokenExpiry: string = ""
    Host: string = ""
    Port: number = 0
    Nodes: NodesConfig = new NodesConfig()
    Console: ConsoleConfig = new ConsoleConfig()
}
