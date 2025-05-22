import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { isDefined } from 'app/utils/nullish'

export function useRunById() {
  const { v2 } = useTypedLoaderData<{
    v2: GetRunByIdV2Query
  }>()

  const run = v2.runs[0]

  const { tomograms, annotationShapes } = v2

  // Sort by isPortalStandard, then isAuthorSubmitted, then by id if all else is equal
  // TODO we should move sort to the backend
  tomograms.sort((t1, t2) => {
    if (t1.isPortalStandard || t2.isPortalStandard) {
      if (!t2.isPortalStandard) {
        return -1
      }

      if (!t1.isPortalStandard) {
        return 1
      }
    } else if (t1.isAuthorSubmitted || t2.isAuthorSubmitted) {
      if (!t2.isAuthorSubmitted) {
        return -1
      }

      if (!t1.isAuthorSubmitted) {
        return 1
      }
    }

    return t2.id - t1.id
  })

  const objectNames =
    v2.uniqueObjectNames.aggregate
      ?.map((aggregate) => aggregate.groupBy?.objectName)
      .filter(isDefined) ?? []

  const objectShapeTypes =
    v2.uniqueShapeTypes.aggregate
      ?.map((aggregate) => aggregate.groupBy?.shapeType)
      .filter(isDefined) ?? []

  const annotationSoftwares =
    v2.uniqueAnnotationSoftwares.aggregate
      ?.map((aggregate) => aggregate.groupBy?.annotationSoftware)
      .filter(isDefined) ?? []

  const resolutions =
    v2.uniqueResolutions.aggregate
      ?.map((aggregate) => aggregate.groupBy?.voxelSpacing)
      .filter(isDefined)
      .sort((resolutionA, resolutionB) => resolutionA - resolutionB) ?? []

  const processingMethods =
    v2.uniqueProcessingMethods.aggregate
      ?.map((aggregate) => aggregate.groupBy?.processing)
      .filter(isDefined)
      .sort((processingMethodA, processingMethodB) =>
        processingMethodA.localeCompare(processingMethodB),
      ) ?? []

  const annotationFilesAggregates = {
    totalCount: v2.numTotalAnnotationRows.aggregate?.[0]?.count ?? 0,
    filteredCount: v2.numFilteredAnnotationRows.aggregate?.[0]?.count ?? 0,
    groundTruthCount:
      v2.numFilteredGroundTruthAnnotationRows.aggregate?.[0]?.count ?? 0,
    otherCount: v2.numFilteredOtherAnnotationRows.aggregate?.[0]?.count ?? 0,
    totalSize:
      v2.numTotalSizeAnnotationFiles?.aggregate?.[0]?.sum?.fileSize ?? 0,
  }

  const tomogramsCount = v2.tomogramsAggregate.aggregate?.[0].count ?? 0
  const ctfCount = v2.perSectionParametersAggregate.aggregate?.[0].count ?? 0
  const alignmentsCount = v2.alignments.length

  const deposition = v2.depositions[0]

  return {
    run,
    tomograms,
    processingMethods,
    objectNames,
    objectShapeTypes,
    annotationSoftwares,
    resolutions,
    annotationFilesAggregates,
    tomogramsCount,
    alignmentsCount,
    ctfCount,
    deposition,
    annotationShapes,
  }
}
