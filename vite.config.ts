import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.FRONTEND_PORT) || 3000,
    host: true,
    open: true
  },
  define: {
    __LUCIAN_ENABLED__: true,
    __ODIN_ENABLED__: true,
    __NEUROFORGE_ENABLED__: true,
    __AERWARE_BRANDING__: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'lucide-react',
      'framer-motion'
    ]
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          lucian: ['@/lib/lucian/index'],
          odin: ['@/lib/odin/index']
        }
      }
    }
  }
})
