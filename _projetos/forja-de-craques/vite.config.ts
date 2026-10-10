import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],base:'./',build:{target:'es2022',outDir:'dist',rollupOptions:{output:{manualChunks:{react:['react','react-dom'],motion:['framer-motion']}}}},server:{host:'127.0.0.1',port:5178,strictPort:true}});
