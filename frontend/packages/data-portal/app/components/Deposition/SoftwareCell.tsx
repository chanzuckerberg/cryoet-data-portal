import Skeleton from '@mui/material/Skeleton'

import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

interface SoftwareCellProps {
  reconstructionSoftware?: string | null
  processingSoftware?: string | null
  width: TableColumnWidth
  isLoading?: boolean
}

function SoftwareRow({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="flex flex-col">
      <span className="text-light-sds-color-semantic-base-text-secondary text-sds-body-xxs-400-wide leading-sds-body-xxs">
        {label}
      </span>
      <span className="break-words">{value || '--'}</span>
    </div>
  )
}

export function SoftwareCell({
  reconstructionSoftware,
  processingSoftware,
  width,
  isLoading,
}: SoftwareCellProps) {
  const { t } = useI18n()

  return (
    <TableCell
      width={width}
      renderLoadingSkeleton={() => (
        <div className="flex flex-col gap-sds-xs">
          <Skeleton className="w-[120px]" variant="text" />
          <Skeleton className="w-[120px]" variant="text" />
        </div>
      )}
      showLoadingSkeleton={isLoading}
    >
      <div className="flex flex-col gap-sds-xs">
        <SoftwareRow
          label={t('reconstructionSoftware')}
          value={reconstructionSoftware}
        />
        <SoftwareRow
          label={t('processingSoftware')}
          value={processingSoftware}
        />
      </div>
    </TableCell>
  )
}
