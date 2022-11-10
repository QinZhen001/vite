import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'
import pages from 'vite-plugin-pages'


// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    // inspect(),
    pages(),
    vue(),
  ],
})
