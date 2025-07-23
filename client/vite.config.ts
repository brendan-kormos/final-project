import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://stackoverflow.com/questions/71763113/how-to-change-vite-application-port
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
