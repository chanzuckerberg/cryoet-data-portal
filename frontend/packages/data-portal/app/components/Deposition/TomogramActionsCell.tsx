import { Button, Icon } from '@czi-sds/components'

import { TableCell } from 'app/components/Table/TableCell'
import { ViewTomogramButton } from 'app/components/ViewTomogramButton'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

interface PlausibleEventData {
  datasetId: number
  organism: string
  runId: number
}

interface TomogramActionsCellProps {
  tomogramId: number
  neuroglancerConfig?: string | null
  isAuthorSubmitted?: boolean
  forceShowViewTomogramButton?: boolean
  width: TableColumnWidth
  plausibleData: PlausibleEventData
  onDownloadClick?: () => void
  onInfoClick?: () => void
  isLoading?: boolean
}

export function TomogramActionsCell({
  tomogramId,
  neuroglancerConfig,
  isAuthorSubmitted,
  forceShowViewTomogramButton = false,
  width,
  plausibleData,
  onDownloadClick,
  onInfoClick,
  isLoading,
}: TomogramActionsCellProps) {
  const { t } = useI18n()

  return (
    <TableCell width={width} showLoadingSkeleton={isLoading}>
      <div className="flex flex-col gap-sds-xs items-start">
        {/* TODO use `isVisualizationDefault` when data is ready */}
        {(forceShowViewTomogramButton || isAuthorSubmitted) && (
          <ViewTomogramButton
            tomogramId={tomogramId.toString()}
            neuroglancerConfig={neuroglancerConfig}
            buttonProps={{
              sdsStyle: 'square',
              sdsType: 'primary',
              className: '!text-sds-body-xxs-400-wide !h-sds-icon-xl',
              startIcon: <Icon sdsIcon="Cube" sdsSize="xs" />,
            }}
            tooltipPlacement="top"
            event={{
              ...plausibleData,
              tomogramId,
              type: 'tomogram',
            }}
          />
        )}

        {onInfoClick && (
          <Button
            sdsType="primary"
            sdsStyle="minimal"
            className="!justify-start !ml-sds-m !text-sds-body-xxs-400-wide"
            onClick={onInfoClick}
            startIcon={<Icon sdsIcon="InfoCircle" sdsSize="xs" />}
          >
            {t('info')}
          </Button>
        )}

        {onDownloadClick && (
          <Button
            sdsType="primary"
            sdsStyle="minimal"
            className="!justify-start !ml-sds-m !text-sds-body-xxs-400-wide"
            onClick={onDownloadClick}
            startIcon={<Icon sdsIcon="Download" sdsSize="xs" />}
          >
            {t('download')}
          </Button>
        )}
      </div>
    </TableCell>
  )
}
