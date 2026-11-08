import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** The site is served from https://<user>.github.io/torquelab/ */
const REPO_BASE = '/torquelab/'

/**
 * GitHub Pages serves static files with no rewrite rule, so a deep link such as
 * /torquelab/procedure/civic-front-brakes would 404 before React Router ever
 * loaded. Pages does serve 404.html for unknown paths, so shipping a copy of
 * index.html under that name lets the app boot and the router resolve the URL
 * itself. .nojekyll stops Pages filtering files it thinks are Jekyll sources.
 */
function githubPagesSpa(): Plugin {
  let cfg: ResolvedConfig
  return {
    name: 'github-pages-spa',
    apply: 'build',
    configResolved(resolved) {
      cfg = resolved
    },
    closeBundle() {
      const out = resolve(cfg.root, cfg.build.outDir)
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))
      writeFileSync(resolve(out, '.nojekyll'), '')
    },
  }
}

export default defineConfig(({ command, isPreview }) => ({
  // The production build lives under a subpath, and `vite preview` has to
  // mirror it or it serves the SPA fallback for every asset. Only the dev
  // server stays at / so `npm run dev` keeps a clean localhost URL.
  base: command === 'build' || isPreview ? REPO_BASE : '/',
  plugins: [react(), tailwindcss(), githubPagesSpa()],
  server: { port: 5181 },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Three.js changes far less often than the course content, so give it
        // its own long-lived chunk.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('@react-three')) return 'r3f'
          if (id.includes('node_modules/react')) return 'react'
        },
      },
    },
  },
}))
