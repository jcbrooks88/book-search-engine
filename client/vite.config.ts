import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': 'http://localhost:3001', // This forwards all /graphql requests to your backend
    },
  },
  build: {
    outDir: 'dist', // Explicitly set the output directory (if needed)
  },
});
