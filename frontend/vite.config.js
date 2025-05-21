import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // Allow external access (e.g., from a domain)
    port: 3000,
    allowedHosts: [/.*\.educonnect\.tech/], // Regex for wildcard subdomains
  },
})