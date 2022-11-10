import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { FilterPattern } from '@rollup/pluginutils'
import { createRPCServer } from 'vite-dev-rpc'

type Awaitable<T> = T | PromiseLike<T>;


export interface RPCFunctions {
  test: (arg: string) => Awaitable<string>
}

export interface Options {
  /**
   * Enable the  plugin in dev mode (could be some performance overhead)
   *
   * @default true
   */
  dev?: boolean,
  /**
   * Enable the  plugin in build mode
   *
   * @default false
   */
  build?: boolean,
  /**
  * Filter for modules to be inspected
  */
  include?: FilterPattern

  /**
   * Filter for modules to not be inspected
   */
  exclude?: FilterPattern
}

const PLUGIN_NAME = 'vite-plugin-test'

export default function VitePluginTest(options: Options = {}): Plugin {
  const {
    dev = true,
    build = false,
  } = options



  if (!dev && !build) {
    return {
      name: PLUGIN_NAME
    }
  }

  let config: ResolvedConfig

  async function generateBuild() {
    // 生成一些report文件之类
  }

  return {
    name: PLUGIN_NAME,
    apply(_, { command }) {
      if (command === 'serve' && dev)
        return true
      if (command === 'build' && build)
        return true
      return false
    },
    configResolved(_config) {
      config = _config
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(`${config.base ? config.base : '/'}__test`,
        (req, res, next) => {
          // 可以作为中间件使用
          res.end('Hello World!')
        })
      // rpc 通信 
      createRPCServer<RPCFunctions>(PLUGIN_NAME, server.ws, {
        test, // ok
      })
      async function test(str: string) {
        return str
      }
    },
    handleHotUpdate({ modules, server }) {
      const ids = modules.map(module => module.id)
    },
    async buildEnd() {
      if (!build)
        return
      // const dir = await generateBuild()
    },
  }
} 
