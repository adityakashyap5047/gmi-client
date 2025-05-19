import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['cc95-2409-40e5-b8-d8a8-418b-c06e-811a-e4e0.ngrok-free.app'],
  },
});
