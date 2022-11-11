import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { FilterPattern } from '@rollup/pluginutils'
import { createRPCServer } from 'vite-dev-rpc'
import _debug from 'debug'

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

const debug =  _debug("vite-plugin-test:test")
const PLUGIN_NAME = 'vite-plugin-test'
const virtualModuleId = 'virtual:my-module'
const resolvedVirtualModuleId = '\0' + virtualModuleId


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
    enforce: 'pre',
    apply(_, { command }) {
      debug('test debug 111')
      setTimeout(()=>{
        debug('test debug 222')
      },2000)
      if (command === 'serve' && dev)
        return true
      if (command === 'build' && build)
        return true
      return false
    },
    resolveId(id) {
      // debug("resolveId ",id)
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    configResolved(_config) {
      // debug("configResolved ",_config)
      config = _config
      // some test 
      // const logger  = config.logger
      // logger.warn("config logger warn")
    },
    // custom api for other plugins 
    // 提供自定义api 给其他插件使用
    api:{
      getV: ():string =>  "I am test plugin"
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
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
      // const ids = modules.map(module => module.id)
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {
          "special-update":"special-update"
        }
      })
    },
    transform(src, id) {
      // 用作文件内容转换
      // console.log("transform src ",src) 文件内容
      // console.log("transform id ",id)   文件名 （绝对路径）
    },
    async buildEnd() {
      if (!build)
        return
      // const dir = await generateBuild()
    },
  }
} 
