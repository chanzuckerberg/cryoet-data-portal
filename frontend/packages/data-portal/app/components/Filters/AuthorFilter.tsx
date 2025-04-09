import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import { InputFilterData, MultiInputFilter } from './MultiInputFilter'

export function AuthorFilter({ label }: { label: string }) {
  const { t } = useI18n()

  const AUTHOR_FILTERS = useMemo<InputFilterData[]>(
    () => [
      {
        id: 'author-name-input',
        label: `${t('authorName')}:`,
        queryParam: QueryParams.AuthorName,
        placeholder: t('authorNamePlaceholder'),
      },
      {
        id: 'author-orcid-input',
        label: `${t('authorOrcid')}:`,
        queryParam: QueryParams.AuthorOrcid,
        placeholder: t('authorOrcidPlaceholder'),
      },
    ],
    [t],
  )

  return <MultiInputFilter label={label} filters={AUTHOR_FILTERS} />
}
