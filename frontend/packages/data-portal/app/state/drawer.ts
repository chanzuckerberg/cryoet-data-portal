import { useUnmountEffect } from '@react-hookz/web'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useMemo } from 'react'

const drawerOpenAtom = atom(false)

export function useDrawer() {
  const [open, setOpen] = useAtom(drawerOpenAtom)

  return useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((prev) => !prev),
    }),
    [open, setOpen],
  )
}

export function useCloseDrawerOnUnmount() {
  const setDrawerOpen = useSetAtom(drawerOpenAtom)

  // Reset drawer state on page unmount
  useUnmountEffect(() => setDrawerOpen(false))
}
