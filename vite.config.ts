import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    allowedHosts: [
      'cae9c917-007f-47be-86ba-0159961920a7-00-3pam7s70q7pth.worf.replit.dev'
    ]
  }
})
