import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './apps/web',
  plugins: [react()],
  server: {
    port: 5173,
  },
})