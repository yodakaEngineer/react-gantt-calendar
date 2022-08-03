import {ModuleFormat} from 'rollup'

import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "ReactGanttCalendar",
      fileName: (format: ModuleFormat) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
})
