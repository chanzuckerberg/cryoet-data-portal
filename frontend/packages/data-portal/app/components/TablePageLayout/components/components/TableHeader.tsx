import { Link } from 'app/components/Link'
import { TableCount } from 'app/components/TablePageLayout/TableCount'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { TableHeaderProps } from '../../types'

export function TableHeader({
  countLabel,
  description,
  filteredCount,
  title,
  totalCount,
  learnMoreLink,
}: TableHeaderProps) {
  const { t } = useI18n()

  return (
    <div
      className={cns(
        'ml-sds-xl p-sds-m flex items-center gap-x-sds-xl screen-1024:mr-sds-xl',
        // NOTE: The title background color is gray on the browse datasets and browse depositions pages
        // If we want to add a description to the single deposition or single run pages, we may need to update this
        !!description && 'bg-light-sds-color-primitive-gray-100',
      )}
    >
      <p className="text-sds-header-l-600-wide leading-sds-header-l font-semibold">
        {title}
      </p>

      <TableCount
        filteredCount={filteredCount}
        totalCount={totalCount}
        type={countLabel}
      />

      <p className="inline">
        {description}
        {learnMoreLink && (
          <Link
            to={learnMoreLink}
            className="text-light-sds-color-primitive-blue-500 ml-sds-xxs"
          >
            {t('learnMore')}
          </Link>
        )}
      </p>
    </div>
  )
}
