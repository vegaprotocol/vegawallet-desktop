/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEGA_HOME: string
  readonly VITE_TESTING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
