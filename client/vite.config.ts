import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': process.env.REACT_APP_API_URL || 'http://localhost:3001', // Use environment variable or default to local
    },
  },  
  build: {
    outDir: 'dist', // Explicitly set the output directory (if needed)
  },
});
