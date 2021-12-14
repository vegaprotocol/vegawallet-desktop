export interface AppConfig {
  URL: string
  LocalPort: number
}

export interface API {
  GRPC: GRPCConfig
  GraphQL: GraphQLConfig
  REST: RESTConfig
}

export interface GRPCConfig {
  Hosts: string[]
  Retries: number
}

export interface GraphQLConfig {
  Hosts: string[]
}

export interface RESTConfig {
  Hosts: string[]
}

export interface Network {
  Name: string
  Level: string
  TokenExpiry: string
  Host: string
  Port: number
  API: API
  Console: AppConfig
  TokenDApp: AppConfig
}

export interface ListNetworksResponse {
  networks: string[]
}

export interface SaveNetworkConfigRequest {
  Name: string
  Level: string
  TokenExpiry: string
  Port: number
  Host: string
  Console: AppConfig
  TokenDApp: AppConfig
  API: API
}


export interface ImportNetworkRequest {
  FilePath: string
  URL: string
  Name: string
  Force: boolean
}

export interface ImportNetworkResponse {
  Name: string
  FilePath: string
}
