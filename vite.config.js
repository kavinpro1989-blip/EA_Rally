import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 48883,
    host: '127.0.0.1',
    strictPort: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
