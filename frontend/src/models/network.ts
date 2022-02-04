export interface ProxyDAppConfig {
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
  Console: ProxyDAppConfig
  TokenDApp: ProxyDAppConfig
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
  Console: ProxyDAppConfig
  TokenDApp: ProxyDAppConfig
  API: API
}

export interface ImportNetworkRequest {
  filePath: string
  url: string
  name: string
  force: boolean
}

export interface ImportNetworkResponse {
  name: string
  filePath: string
}
