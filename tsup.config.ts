import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  // CSS is exported separately via the ./styles export path
  // Consumers must import '@corephp/core-ui/styles' in their root CSS/layout
  treeshake: true,
  splitting: true,
})
