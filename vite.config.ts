import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Ignore "use client" directives
      babel: {
        parserOpts: {
          plugins: ['typescript', 'jsx'],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@storage': resolve(__dirname, './src/storage'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@styles': resolve(__dirname, './src/styles'),
    },
  },
  build: {
    outDir: 'dist',
    watch: process.env.WATCH === 'true' ? {} : null,
    sourcemap: mode === 'development',
    minify: mode === 'development' ? false : true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
        db: resolve(__dirname, 'src/db.ts'),
      },
      output: {
        entryFileNames: mode === 'development' ? '[name].js' : '[name].[hash].js',
        chunkFileNames: mode === 'development' ? '[name].js' : '[name].[hash].js',
        assetFileNames: mode === 'development' ? '[name].[ext]' : '[name].[hash].[ext]',
      },
      onwarn(warning, warn) {
        // Ignore "use client" directive warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
})); 