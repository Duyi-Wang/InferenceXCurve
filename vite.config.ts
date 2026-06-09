import { defineConfig } from 'vite';

export default defineConfig({
  base: '/InferenceXCurve/',
  server: {
    proxy: {
      '/inferencex-api': {
        target: 'https://inferencex.semianalysis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/inferencex-api/u, '/api')
      }
    }
  }
});
