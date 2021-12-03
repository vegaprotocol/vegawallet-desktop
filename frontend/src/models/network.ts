export class ConsoleConfig {
  URL: string = ''
  LocalPort: number = 0
}

export class API {
  GRPC: GRPCConfig = new GRPCConfig()
  GraphQL: GraphQLConfig = new GraphQLConfig()
  REST: RESTConfig = new RESTConfig()
}

export class GRPCConfig {
  Hosts: string[] = []
  Retries: number = 0
}

export class GraphQLConfig {
  Hosts: string[] = []
}

export class RESTConfig {
  Hosts: string[] = []
}

export class Network {
  Name: string = ''
  Level: string = ''
  TokenExpiry: string = ''
  Host: string = ''
  Port: number = 0
  API: API = new API()
  Console: ConsoleConfig = new ConsoleConfig()
}

export class ListNetworksResponse {
  networks: string[] = []
}

export class SaveNetworkConfigRequest {
  Name: string = ''
  Level: string = ''
  TokenExpiry: string = ''
  Port: number = 0
  Host: string = ''
  Console: ConsoleConfig = new ConsoleConfig()
  API: API = new API()
}
