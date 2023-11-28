import { createContext, useContext } from 'react'

export interface LayoutContextValue {
  hasFilters: boolean
}

export const LayoutContext = createContext<LayoutContextValue>({
  hasFilters: false,
})

export function useLayout() {
  return useContext(LayoutContext)
}
