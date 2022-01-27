export interface GetVersionResponse {
  version: string
  gitHash: string
}

export interface CheckVersionResponse {
  version: string
  releaseUrl: string
}
