import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // Allow external access (e.g., from a domain)
    port: 4173,
    allowedHosts: [/.*\.educonnect\.tech/], // Regex for wildcard subdomains
  },
})
  */
