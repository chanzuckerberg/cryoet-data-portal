import { AppLoadContext } from 'react-router'

export interface ServerContext extends AppLoadContext {
  clientIp: string
}
