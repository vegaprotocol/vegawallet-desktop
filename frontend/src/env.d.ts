/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEGA_HOME: string
  readonly VITE_TESTING: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
