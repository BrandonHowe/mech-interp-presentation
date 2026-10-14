import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at njitaisafety.org/mech-interp-presentation/ (copied into the club
// website's public folder; see `npm run export:club`).
export default defineConfig({
  base: '/mech-interp-presentation/',
  plugins: [react()],
})
