import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project site: https://spicorn.github.io/Agrisure/
// Dev stays at / so `npm run dev` is unchanged. The production build prefixes every asset.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Agrisure/' : '/',
  plugins: [react(), tailwindcss()],
}))
