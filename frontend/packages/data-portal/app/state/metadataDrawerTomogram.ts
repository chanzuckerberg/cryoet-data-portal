import { atom } from 'jotai'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export type Tomogram = GetRunByIdQuery['tomograms'][number]

/** Tomogram row selected to be opened in the metadata sidebar. */
export const metadataDrawerTomogramAtom = atom<Tomogram | undefined>(undefined)
