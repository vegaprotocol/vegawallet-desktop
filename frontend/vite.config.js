import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig(args => {
  return {
    build: {
      minify: args.mode !== 'development',
      sourcemap: true
    },
    plugins: [
      react(),
      eslint(),
      istanbul({
        include: 'src/*',
        // exclude: ['node_modules', 'automation/'],
        extension: ['.js', '.ts', '.tsx'],
        // requireEnv: true,
        forceBuildInstrument: true
      })
    ]
  }
})
