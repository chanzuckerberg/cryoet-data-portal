import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { typedjson } from 'remix-typedjson'

import { apolloClientV2 } from 'app/apollo.server'
import { DepositionFilters } from 'app/components/Deposition/DepositionFilters'
import { DepositionGroupByControl } from 'app/components/Deposition/DepositionGroupByControl'
import { DepositionHeader } from 'app/components/Deposition/DepositionHeader'
import { DepositionMetadataDrawer } from 'app/components/Deposition/DepositionMetadataDrawer'
import { DepositionTableSection } from 'app/components/Deposition/DepositionTableSection'
import { NoResultsRenderer } from 'app/components/Deposition/NoResultsRenderer'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { TableCountHeader } from 'app/components/TablePageLayout/TableCountHeader'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionPageState } from 'app/hooks/useDepositionPageState'
import { useGroupBy } from 'app/hooks/useGroupBy'
import { useI18n } from 'app/hooks/useI18n'
import { getTableCounts } from 'app/utils/deposition/countSelectors'
import { fetchDepositionData } from 'app/utils/deposition/dataFetchers'
import { getCountLabelI18nKey } from 'app/utils/deposition/labelSelectors'
import {
  parseLoaderParams,
  validateDepositionId,
} from 'app/utils/deposition/loaderValidation'
import { shouldRevalidatePage } from 'app/utils/revalidate'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Validate and parse parameters
  const id = validateDepositionId(params.id)
  const loaderParams = parseLoaderParams(url, id)

  const client = apolloClientV2

  // Fetch all deposition data
  const data = await fetchDepositionData({
    client,
    params: loaderParams,
    url,
  })

  return typedjson(data)
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.AuthorName,
      QueryParams.AuthorOrcid,
      QueryParams.AvailableFiles,
      QueryParams.CameraManufacturer,
      QueryParams.DatasetId,
      QueryParams.DepositionTab,
      QueryParams.EmdbId,
      QueryParams.EmpiarId,
      QueryParams.FiducialAlignmentStatus,
      QueryParams.GroundTruthAnnotation,
      QueryParams.NumberOfRuns,
      QueryParams.ObjectId,
      QueryParams.ObjectName,
      QueryParams.ObjectShapeType,
      QueryParams.Organism,
      QueryParams.ReconstructionMethod,
      QueryParams.ReconstructionMethod,
      QueryParams.Sort,
      QueryParams.TiltRangeMax,
      QueryParams.TiltRangeMin,
    ],
  })
}

export default function DepositionByIdPage() {
  const [type] = useActiveDepositionDataType()
  const [groupBy] = useGroupBy()
  const { t } = useI18n()

  const state = useDepositionPageState()

  // Calculate counts using extracted utility
  const { totalCount, filteredCount } = getTableCounts({
    tab: type,
    groupBy,
    groupedData: state.groupedData,
    annotationsCount: state.annotationsCount,
    tomogramsCount: state.tomogramsCount,
    filteredAnnotationsCount: state.filteredAnnotationsCount,
    filteredTomogramsCount: state.filteredTomogramsCount,
    totalDatasetsCount: state.totalDatasetsCount,
    filteredDatasetsCount: state.filteredDatasetsCount,
  })

  // Get count label using extracted utility
  const countLabelKey = getCountLabelI18nKey({
    type,
    groupBy,
  })

  return (
    <TablePageLayout
      title={t('depositedData')}
      titleContent={<DepositionGroupByControl />}
      header={<DepositionHeader />}
      tabs={[
        {
          countLabel: t(countLabelKey),
          noFilteredResults: (
            <NoResultsRenderer isLoading={state.groupedData.isLoading} />
          ),
          title: t('datasetsWithDepositionData'),
          Header: TableCountHeader,
          table: <DepositionTableSection groupedData={state.groupedData} />,
          totalCount,
          filteredCount,
          filterPanel: <DepositionFilters />,
          pageSize: MAX_PER_ACCORDION_GROUP,
        },
      ]}
      drawers={<DepositionMetadataDrawer />}
    />
  )
}
