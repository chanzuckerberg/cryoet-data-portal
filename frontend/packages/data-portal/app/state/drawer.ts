import { useUnmountEffect } from '@react-hookz/web'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useMemo } from 'react'

export type DrawerId =
  | 'dataset-metadata'
  | 'run-metadata'
  | 'annotation-metadata'

const activeDrawerIdAtom = atom<DrawerId | null>(null)

export function useDrawer() {
  const [activeDrawerId, setActiveDrawerId] = useAtom(activeDrawerIdAtom)

  return useMemo(
    () => ({
      activeDrawerId,
      setActiveDrawerId,
    }),
    [activeDrawerId, setActiveDrawerId],
  )
}

export function useCloseDrawerOnUnmount() {
  const setActiveDrawerId = useSetAtom(activeDrawerIdAtom)

  // Reset drawer state on page unmount
  useUnmountEffect(() => setActiveDrawerId(null))
}
