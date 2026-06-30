import { useLocation } from '@remix-run/react'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

import { QueryParams } from 'app/constants/query'

export enum MetadataDrawerId {
  Annotation = 'annotation',
  Dataset = 'dataset',
  Deposition = 'deposition',
  Run = 'run',
  Tomogram = 'tomogram',
}

export enum MetadataTab {
  HowToCite = 'howToCite',
  Metadata = 'metadata',
  MethodSummary = 'methodSummary',
  ObjectOverview = 'objectOverview',
}

// The drawer's open/close state is view state, not navigation state. Keeping it
// in React Router search params meant every toggle changed the router location
// context and re-rendered the entire page tree (MUI + Emotion re-serializing
// styles for thousands of nodes ~ 1s of work), which is the open/close lag.
//
// Instead we hold it in local Jotai atoms (only the drawer + its trigger button
// subscribe, so a toggle re-renders almost nothing) and mirror it into the URL
// via the History API below — which keeps the address bar shareable/reloadable
// WITHOUT a React Router navigation, so the page never re-renders on toggle.
const activeDrawerAtom = atom<MetadataDrawerId | null>(null)
const activeTabAtom = atom<MetadataTab | null>(null)

function writeDrawerToUrl(
  drawer: MetadataDrawerId | null,
  tab: MetadataTab | null,
) {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(window.location.href)

  if (drawer) {
    url.searchParams.set(QueryParams.MetadataDrawer, drawer)
  } else {
    url.searchParams.delete(QueryParams.MetadataDrawer)
  }

  if (tab) {
    url.searchParams.set(QueryParams.Tab, tab)
  } else {
    url.searchParams.delete(QueryParams.Tab)
  }

  // replaceState (not pushState) so drawer toggles don't pile up history
  // entries, and crucially so React Router does not observe the change.
  window.history.replaceState(window.history.state, '', url)
}

export function useMetadataDrawer() {
  const [activeDrawer, setActiveDrawer] = useAtom(activeDrawerAtom)
  const [activeTab, setActiveTabState] = useAtom(activeTabAtom)

  const openDrawer = useCallback(
    (drawer: MetadataDrawerId, tab: MetadataTab = MetadataTab.Metadata) => {
      setActiveDrawer(drawer)
      setActiveTabState(tab)
      writeDrawerToUrl(drawer, tab)
    },
    [setActiveDrawer, setActiveTabState],
  )

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null)
    setActiveTabState(null)
    writeDrawerToUrl(null, null)
  }, [setActiveDrawer, setActiveTabState])

  const toggleDrawer = useCallback(
    (drawer: MetadataDrawerId, tab: MetadataTab = MetadataTab.Metadata) => {
      const willOpen = activeDrawer !== drawer
      const nextDrawer = willOpen ? drawer : null
      const nextTab = willOpen ? tab : null

      setActiveDrawer(nextDrawer)
      setActiveTabState(nextTab)
      writeDrawerToUrl(nextDrawer, nextTab)
    },
    [activeDrawer, setActiveDrawer, setActiveTabState],
  )

  const setActiveTab = useCallback(
    (tab: MetadataTab) => {
      setActiveTabState(tab)
      writeDrawerToUrl(activeDrawer, tab)
    },
    [activeDrawer, setActiveTabState],
  )

  return {
    activeDrawer,
    activeTab,
    closeDrawer,
    openDrawer,
    setActiveTab,
    toggleDrawer,
  }
}

/**
 * Seeds the drawer atoms from the URL on initial load and on page navigations,
 * restoring deep-links like `?metadata=deposition&tab=metadata`. Mount once at
 * the app root.
 *
 * Depends on `pathname` only, on purpose: search-param changes (filters, sort,
 * and our own `writeDrawerToUrl` calls) must NOT reset the drawer, while a real
 * navigation to another page should.
 */
export function useMetadataDrawerUrlSync() {
  const { pathname } = useLocation()
  const setActiveDrawer = useSetAtom(activeDrawerAtom)
  const setActiveTab = useSetAtom(activeTabAtom)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const drawer = params.get(
      QueryParams.MetadataDrawer,
    ) as MetadataDrawerId | null
    const tab = params.get(QueryParams.Tab) as MetadataTab | null

    setActiveDrawer(drawer)
    setActiveTab(drawer ? tab ?? MetadataTab.Metadata : null)
  }, [pathname, setActiveDrawer, setActiveTab])
}
