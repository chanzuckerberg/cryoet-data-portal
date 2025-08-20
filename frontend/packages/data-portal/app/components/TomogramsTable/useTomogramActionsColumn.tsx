import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { TomogramActionsCell } from 'app/components/Deposition/TomogramActionsCell'
import { CellHeader } from 'app/components/Table/CellHeader'
import { type TableColumnWidth } from 'app/constants/table'

const columnHelper = createColumnHelper<Tomogram>()

interface PlausibleEventData {
  datasetId: number
  organism: string
  runId: number
}

export function useTomogramActionsColumn({
  forceShowViewTomogramButton = false,
  getPlausibleData,
  onDownloadClick,
  onInfoClick,
  width,
}: {
  forceShowViewTomogramButton?: boolean
  getPlausibleData(tomogram: Tomogram): PlausibleEventData
  onDownloadClick?(tomogram: Tomogram): void
  onInfoClick?(tomogram: Tomogram): void
  width: TableColumnWidth
}) {
  return columnHelper.display({
    id: 'tomogram-actions',

    header: () => <CellHeader width={width} />,

    cell: ({ row: { original } }) => (
      <TomogramActionsCell
        tomogramId={original.id}
        neuroglancerConfig={original.neuroglancerConfig}
        isAuthorSubmitted={original.isAuthorSubmitted ?? undefined}
        forceShowViewTomogramButton={forceShowViewTomogramButton}
        width={width}
        plausibleData={getPlausibleData(original)}
        onDownloadClick={
          onDownloadClick ? () => onDownloadClick(original) : undefined
        }
        onInfoClick={onInfoClick ? () => onInfoClick(original) : undefined}
      />
    ),
  })
}
