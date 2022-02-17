export interface ProxyDAppConfig {
  url: string
  localPort: number
}

export interface API {
  grpc: GRPCConfig
  graphQl: GraphQLConfig
  rest: RESTConfig
}

export interface GRPCConfig {
  hosts: string[]
  retries: number
}

export interface GraphQLConfig {
  hosts: string[]
}

export interface RESTConfig {
  hosts: string[]
}

export interface Network {
  name: string
  level: string
  tokenExpiry: string
  host: string
  port: number
  api: API
  console: ProxyDAppConfig
  tokenDApp: ProxyDAppConfig
}

export interface ListNetworksResponse {
  networks: string[]
}

export interface SaveNetworkConfigRequest {
  name: string
  level: string
  tokenExpiry: string
  port: number
  host: string
  console: ProxyDAppConfig
  tokenDApp: ProxyDAppConfig
  api: API
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
