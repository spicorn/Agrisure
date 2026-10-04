import { copyFileSync, writeFileSync } from 'node:fs'

// GitHub Pages has no SPA rewrite. A copy of the app at 404.html keeps /demo and the other routes alive.
copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')
