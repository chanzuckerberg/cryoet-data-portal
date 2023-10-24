import { useUnmountEffect } from '@react-hookz/web'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useMemo } from 'react'

export const datasetDrawerOpenAtom = atom(false)

export function useDatasetDrawer() {
  const [open, setOpen] = useAtom(datasetDrawerOpenAtom)

  return useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((prev) => !prev),
    }),
    [open, setOpen],
  )
}

export function useCloseDatasetDrawerOnUnmount() {
  const setDrawerOpen = useSetAtom(datasetDrawerOpenAtom)

  // Reset drawer state on page unmount
  useUnmountEffect(() => setDrawerOpen(false))
}
