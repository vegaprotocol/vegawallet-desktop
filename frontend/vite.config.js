import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig(args => {
  return {
    build: {
      minify: args.mode === 'development',
      sourcemap: true
    },
    plugins: [react(), eslint()]
  }
})
