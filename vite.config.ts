/// <reference types="vitest" />

import { ModuleFormat } from 'rollup'

import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    setupFiles: './src/setup.ts',
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'ReactGanttCalendar',
      fileName: (format: ModuleFormat) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
})
