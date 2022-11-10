import { createRPCClient } from 'vite-dev-rpc'
import { hot } from 'vite-hot-client'
import type { RPCFunctions } from "vite-plugin-test"

export const rpc = createRPCClient<RPCFunctions>('vite-plugin-test', hot!)


