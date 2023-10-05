import { createContext } from 'react'

export interface ClientStyleContextValue {
  reset(): void
}

export const ClientStyleContext = createContext<ClientStyleContextValue>({
  reset: () => {},
})
