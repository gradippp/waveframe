import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Dual distribution
  dts: true,              // Generate TypeScript declarations
  clean: true,            // Clean dist before build
  external: ['react', 'react-dom', 'tailwindcss'], // NEVER bundle React or Tailwind
  minify: true,           // Minify for production
  sourcemap: true,
  treeshake: true,
});
