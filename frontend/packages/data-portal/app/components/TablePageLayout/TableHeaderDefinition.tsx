import { ReactNode } from 'react'

import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'

import { TableCount } from './TableCount'
import { TableHeaderProps } from './TableHeader'

export function TableHeaderDefinition({
  countLabel,
  filteredCount,
  totalCount,
  title,
  description,
  learnMoreLink,
  search,
}: TableHeaderProps & {
  search?: ReactNode
}) {
  const { t } = useI18n()

  return (
    <div className="pt-sds-s px-sds-xl max-w-content">
      <h1 className="text-sds-header-xxl-600-wide leading-sds-header-xxl tracking-sds-header-xxl-600-wide font-semibold">
        {title}
      </h1>

      <p className="text-sds-body-s-400-wide leading-sds-body-s tracking-sds-body-s-400-wide max-w-[600px] mt-sds-s">
        <span className="text-sds-color-semantic-text-base-secondary">
          {description}
        </span>

        {learnMoreLink && (
          <Link
            className="text-sds-color-semantic-text-action-default hover:text-sds-color-semantic-text-action-hover"
            to={learnMoreLink}
          >
            {' '}
            {t('learnMore')}
          </Link>
        )}
      </p>

      <div className="flex justify-between items-center mt-sds-xl">
        <TableCount
          filteredCount={filteredCount}
          totalCount={totalCount}
          type={countLabel}
        />

        {search}
      </div>
    </div>
  )
}
