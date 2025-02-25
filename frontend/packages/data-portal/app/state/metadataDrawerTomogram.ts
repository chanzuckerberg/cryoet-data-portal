import { atom } from 'jotai'

import { TomogramV2 } from 'app/types/gql/runPageTypes'

/** Tomogram row selected to be opened in the metadata sidebar. */
export const metadataDrawerTomogramAtom = atom<TomogramV2 | undefined>(
  undefined,
)
