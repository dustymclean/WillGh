import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
<<<<<<< HEAD
    return {
      base: '/', // Essential for the custom domain willgh.com
=======
    const env = loadEnv(mode, '.', '');
    return {
>>>>>>> 03c73cf (Initialize sovereign photography suite and fix repo connection)
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
<<<<<<< HEAD
=======
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
>>>>>>> 03c73cf (Initialize sovereign photography suite and fix repo connection)
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
