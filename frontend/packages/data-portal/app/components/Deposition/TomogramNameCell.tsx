import Skeleton from '@mui/material/Skeleton'

import { AuthorList } from 'app/components/AuthorList'
import { Link } from 'app/components/Link'
import { TableCell } from 'app/components/Table/TableCell'
import { TomogramTypeBadge } from 'app/components/TomogramTypeBadge'
import { IdPrefix } from 'app/constants/idPrefixes'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { getTomogramName } from 'app/utils/tomograms'

interface Author {
  name: string
}

interface TomogramNameCellProps {
  id: number
  processing?: string
  reconstructionMethod?: string
  isPortalStandard?: boolean
  isAuthorSubmitted?: boolean
  authors?: { edges: { node: Author }[] }
  showAuthors?: boolean
  width: TableColumnWidth
  isLoading?: boolean
}

export function TomogramNameCell({
  id,
  processing,
  reconstructionMethod,
  isPortalStandard,
  isAuthorSubmitted,
  authors,
  showAuthors = false,
  width,
  isLoading,
}: TomogramNameCellProps) {
  const { t } = useI18n()

  // Use getTomogramName if we have the required fields, otherwise fallback to name or generated name
  const displayName =
    processing && reconstructionMethod
      ? getTomogramName({ id, processing, reconstructionMethod })
      : '--'

  return (
    <TableCell
      className="flex flex-col !items-start"
      width={width}
      renderLoadingSkeleton={() => (
        <div>
          <Skeleton className="w-[200px]" variant="text" />
          <Skeleton className="w-[150px]" variant="text" />
          {showAuthors && <Skeleton className="w-[180px]" variant="text" />}
        </div>
      )}
      showLoadingSkeleton={isLoading}
    >
      <div className="text-sds-body-m-400-wide leading-sds-body-m font-semibold text-ellipsis line-clamp-1 break-all">
        <Link
          to={`/tomograms/${id}`}
          className="text-light-sds-color-semantic-base-link hover:text-light-sds-color-semantic-base-link"
        >
          {displayName}
        </Link>
      </div>

      <div className="flex items-center flex-wrap gap-sds-xs text-sds-body-xxs-400-wide mt-sds-xxxs">
        {`${t('tomogramId')}: ${IdPrefix.Tomogram}-${id}`}

        {isPortalStandard && <TomogramTypeBadge type="standard" showTooltip />}

        {isAuthorSubmitted && <TomogramTypeBadge type="author" showTooltip />}
      </div>

      {showAuthors && authors && (
        <div className=" text-light-sds-color-semantic-base-text-secondary text-sds-body-xxs-400-wide leading-sds-header-xxs mt-2">
          <AuthorList
            authors={authors.edges.map((edge) => edge.node)}
            compact
          />
        </div>
      )}
    </TableCell>
  )
}
