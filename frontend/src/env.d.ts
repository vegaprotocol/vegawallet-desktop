/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEGA_HOME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
