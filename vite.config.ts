import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages subpath: https://<user>.github.io/<repo>/
// Repo is "neurokitsune/makeup". Override with VITE_BASE if you deploy elsewhere.
const base = process.env.VITE_BASE ?? '/makeup/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
