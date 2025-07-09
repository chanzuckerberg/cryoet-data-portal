import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { AuthorList } from 'app/components/AuthorList'
import { CellHeader } from 'app/components/Table/CellHeader'
import { TableCell } from 'app/components/Table/TableCell'
import { TomogramTypeBadge } from 'app/components/TomogramTypeBadge'
import { IdPrefix } from 'app/constants/idPrefixes'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { getTomogramName } from 'app/utils/tomograms'

const columnHelper = createColumnHelper<Tomogram>()

export function useTomogramNameColumn({
  showAuthors = false,
  width,
}: {
  showAuthors?: boolean
  width: TableColumnWidth
}) {
  const { t } = useI18n()

  return columnHelper.accessor('id', {
    header: () => <CellHeader width={width}>{t('tomogramName')}</CellHeader>,

    cell: ({ row: { original } }) => (
      <TableCell className="flex flex-col !items-start" width={width}>
        <div className="text-sds-body-m-400-wide leading-sds-body-m font-semibold text-ellipsis line-clamp-1 break-all">
          {getTomogramName(original)}
        </div>

        <div className="flex items-center flex-wrap gap-sds-xs text-sds-body-xxs-400-wide mt-sds-xxxs">
          {`${t('tomogramId')}: ${IdPrefix.Tomogram}-${original.id}`}

          {original.isPortalStandard && (
            <TomogramTypeBadge type="standard" showTooltip />
          )}

          {original.isAuthorSubmitted && (
            <TomogramTypeBadge type="author" showTooltip />
          )}
        </div>

        {showAuthors && (
          <div className=" text-light-sds-color-semantic-base-text-secondary text-sds-body-xxs-400-wide leading-sds-header-xxs mt-2">
            <AuthorList
              authors={original.authors.edges.map((edge) => edge.node)}
              compact
            />
          </div>
        )}
      </TableCell>
    ),
  })
}
