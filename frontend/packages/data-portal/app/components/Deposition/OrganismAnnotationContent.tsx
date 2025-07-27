import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { useDepositionAnnotationsByOrganism } from 'app/queries/useDepositionAnnotationsByOrganism'

import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { OrganismDataContent } from './OrganismDataContent'

interface OrganismAnnotationContentProps {
  depositionId: number | undefined
  organismName: string
  page: number
}

export function OrganismAnnotationContent({
  depositionId,
  organismName,
  page,
}: OrganismAnnotationContentProps) {
  const { t } = useI18n()
  const { data, isLoading, error } = useDepositionAnnotationsByOrganism({
    depositionId,
    organismName,
    page,
    pageSize: MAX_PER_FULLY_OPEN_ACCORDION,
  })

  return (
    <OrganismDataContent
      data={data}
      isLoading={isLoading}
      error={error}
      TableComponent={DepositionAnnotationTable}
      dataAccessor={(hookData) => hookData.annotations || []}
      errorMessage={t('errorLoadingAnnotations')}
      showLoadingSkeleton
    />
  )
}
