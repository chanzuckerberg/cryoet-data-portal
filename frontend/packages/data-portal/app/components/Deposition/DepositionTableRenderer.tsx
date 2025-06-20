import { DepositionTab, useDepositionTab } from 'app/hooks/useDepositionTab'

import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { DepositionTomogramTable } from './DepositionTomogramTable'

export function DepositionTableRenderer() {
  const [tab] = useDepositionTab()

  switch (tab) {
    case DepositionTab.Tomograms:
      return <DepositionTomogramTable />

    default:
      return <DepositionAnnotationTable />
  }
}
