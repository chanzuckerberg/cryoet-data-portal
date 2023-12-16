import { AppLoadContext } from '@remix-run/server-runtime'

export interface ServerContext extends AppLoadContext {
  clientIp: string
}
