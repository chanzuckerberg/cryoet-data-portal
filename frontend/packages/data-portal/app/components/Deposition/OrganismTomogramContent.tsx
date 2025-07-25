import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { useDepositionTomogramsByOrganism } from 'app/queries/useDepositionTomogramsByOrganism'

import { DepositionTomogramTable } from './DepositionTomogramTable'
import { OrganismDataContent } from './OrganismDataContent'

interface OrganismTomogramContentProps {
  depositionId: number | undefined
  organismName: string
  page: number
}

export function OrganismTomogramContent({
  depositionId,
  organismName,
  page,
}: OrganismTomogramContentProps) {
  const { t } = useI18n()
  const { data, isLoading, error } = useDepositionTomogramsByOrganism({
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
      TableComponent={DepositionTomogramTable}
      dataAccessor={(hookData) => hookData.tomograms || []}
      errorMessage={t('errorLoadingTomograms')}
    />
  )
}
