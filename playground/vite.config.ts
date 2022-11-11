import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'
import test from 'vite-plugin-test'
import topLevelAwait from 'vite-plugin-top-level-await'
import type { Plugin } from 'vite'


const customPlugin = (): Plugin => {
  let api: any

  return {
    name: "vite-plugin-custom1",
    // enforce: 'pre',
    // build 的时候才会触发
    buildStart({ plugins }) {
      console.log('111', plugins)
      // const parentName = 'parent';
      // const parentPlugin = plugins.find(plugin => plugin.name === parentName);
    },
    transform(code, id) {
      // api(code)
    }
  }
}


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['edge90', 'chrome90', 'firefox90', 'safari15']
  },
  plugins: [
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i: any) => `__tla_${i}`
    }),   // topLevelAwait({
    //   // The export name of top-level await promise for each chunk module
    //   promiseExportName: '__tla',
    //   // The function to generate import names of top-level await promise in each chunk module
    //   promiseImportName: i => `__tla_${i}`
    // })
    // inspect(),
    vue(),
    test({
      build: true,
    }),
    customPlugin(),
  ],
})
