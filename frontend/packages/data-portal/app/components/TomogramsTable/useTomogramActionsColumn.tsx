import { Button, Icon } from '@czi-sds/components'
import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { CellHeader } from 'app/components/Table/CellHeader'
import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { ViewTomogramButton } from '../ViewTomogramButton'

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
  const { t } = useI18n()

  return columnHelper.display({
    id: 'tomogram-actions',

    header: () => <CellHeader width={width} />,

    cell: ({ row: { original } }) => (
      <TableCell width={width}>
        <div className="flex flex-col gap-sds-xs items-start">
          {/* TODO use `isVisualizationDefault` when data is ready */}
          {(forceShowViewTomogramButton || original.isAuthorSubmitted) && (
            <ViewTomogramButton
              tomogramId={original.id.toString()}
              neuroglancerConfig={original.neuroglancerConfig}
              buttonProps={{
                sdsStyle: 'square',
                sdsType: 'primary',
                className: '!text-sds-body-xxs-400-wide !h-sds-icon-xl',
                startIcon: <Icon sdsIcon="Cube" sdsSize="xs" />,
              }}
              tooltipPlacement="top"
              event={{
                ...getPlausibleData(original),
                tomogramId: original.id,
                type: 'tomogram',
              }}
            />
          )}

          {onInfoClick && (
            <Button
              sdsType="primary"
              sdsStyle="minimal"
              className="!justify-start !ml-sds-m !text-sds-body-xxs-400-wide"
              onClick={() => onInfoClick(original)}
              startIcon={<Icon sdsIcon="InfoCircle" sdsSize="xs" />}
            >
              <span>{t('info')}</span>
            </Button>
          )}

          {onDownloadClick && (
            <Button
              sdsType="primary"
              sdsStyle="minimal"
              className="!justify-start !ml-sds-m !text-sds-body-xxs-400-wide"
              onClick={() => onDownloadClick(original)}
              startIcon={<Icon sdsIcon="Download" sdsSize="xs" />}
            >
              {t('download')}
            </Button>
          )}
        </div>
      </TableCell>
    ),
  })
}
