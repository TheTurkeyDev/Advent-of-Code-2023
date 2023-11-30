import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 8082,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/aoc': {
                target: 'http://localhost:8082',
                rewrite: (path) => path.replace(/^\/aoc/, ''),
            },
        }
    }
});