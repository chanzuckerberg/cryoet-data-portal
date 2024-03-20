import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import { InputFilterData, MultiInputFilter } from './MultiInputFilter'

export function AuthorFilter() {
  const { t } = useI18n()

  const AUTHOR_FILTERS = useMemo<InputFilterData[]>(
    () => [
      {
        id: 'author-name-input',
        label: `${t('authorName')}:`,
        queryParam: QueryParams.AuthorName,
      },
      {
        id: 'author-orcid-input',
        label: `${t('authorOrcid')}:`,
        queryParam: QueryParams.AuthorOrcid,
      },
    ],
    [t],
  )

  return <MultiInputFilter label={t('author')} filters={AUTHOR_FILTERS} />
}
