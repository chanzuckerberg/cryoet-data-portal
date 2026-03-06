import { DefaultAutocompleteOption } from '@czi-sds/components'
import React, { createContext, useContext, useState } from 'react'

export type PrefixOption = DefaultAutocompleteOption & {
  link: string
  prefix: string
  placeholder: string
}

type PrefixValueContextType = {
  prefixValue: PrefixOption | null
  setPrefixValue: (value: PrefixOption | null) => void
  inputDropdownValue: string | null
  setInputDropdownValue: (value: string | null) => void
}

const PrefixValueContext = createContext<PrefixValueContextType | undefined>(
  undefined,
)

export function PrefixValueProvider({
  children,
  initialOptions,
}: {
  children: React.ReactNode
  initialOptions: PrefixOption[]
}) {
  const [prefixValue, setPrefixValue] = useState<PrefixOption | null>(
    initialOptions[0] ?? null,
  )
  const [inputDropdownValue, setInputDropdownValue] = useState<string | null>(
    initialOptions[0]?.name ?? null,
  )

  const contextValue = React.useMemo(
    () => ({
      prefixValue,
      setPrefixValue,
      inputDropdownValue,
      setInputDropdownValue,
    }),
    [prefixValue, inputDropdownValue],
  )

  return (
    <PrefixValueContext.Provider value={contextValue}>
      {children}
    </PrefixValueContext.Provider>
  )
}

export function usePrefixValueContext() {
  const ctx = useContext(PrefixValueContext)
  if (!ctx)
    throw new Error(
      'usePrefixValueContext must be used within PrefixValueProvider',
    )
  return ctx
}
