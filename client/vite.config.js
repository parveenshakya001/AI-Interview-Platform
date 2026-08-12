import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // bind to 0.0.0.0 so Codespaces port forwarding can reach it
    port: 5173,        // keep it explicit (optional, but avoids surprises)
    strictPort: true,   // fail loudly instead of silently switching ports
    hmr: {
      clientPort: 443,  // Codespaces proxies HTTPS on 443, HMR needs to know that
    },
  },
})