import { ModuleFormat } from 'rollup'

import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'ReactGanttCalendar',
      fileName: (format: ModuleFormat) => `index.${format}.js`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
