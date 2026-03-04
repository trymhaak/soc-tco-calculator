import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/soc-tco-calculator/',
  server: {
    port: 3000,
    open: true
  }
})
