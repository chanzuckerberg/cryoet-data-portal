import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import {
  Annotation_Method_Link_Type_Enum,
  Annotation_Method_Type_Enum,
  type GetDepositionAnnotationsQuery,
  GetDepositionBaseDataV2Query,
  GetDepositionExpandedDataV2Query,
  GetDepositionLegacyDataV2Query,
  type GetDepositionTomogramsQuery,
} from 'app/__generated_v2__/graphql'
import { METHOD_TYPE_ORDER } from 'app/constants/methodTypes'

export interface AnnotationMethodMetadata {
  annotationMethod: string
  annotationSoftware?: string
  methodType?: Annotation_Method_Type_Enum
  count: number
  methodLinks: Array<{
    name?: string
    linkType?: Annotation_Method_Link_Type_Enum
    link?: string
  }>
}

export function useDepositionById() {
  const { v2, annotations, tomograms } = useTypedLoaderData<{
    v2: GetDepositionBaseDataV2Query &
      Partial<GetDepositionLegacyDataV2Query> &
      Partial<GetDepositionExpandedDataV2Query>
    annotations?: GetDepositionAnnotationsQuery
    tomograms?: GetDepositionTomogramsQuery
  }>()

  const annotationMethods: AnnotationMethodMetadata[] = useMemo(() => {
    const annotationMethodToMetadata = new Map<
      string,
      Omit<AnnotationMethodMetadata, 'annotationMethod'>
    >()
    // Populate everything except counts:
    for (const { groupBy } of v2.depositions[0]
      ?.annotationMethodAndMethodLinksCombinations?.aggregate ?? []) {
      const annotationMethod = groupBy?.annotationMethod
      if (annotationMethod == null) {
        continue
      }
      if (!annotationMethodToMetadata.has(annotationMethod)) {
        annotationMethodToMetadata.set(annotationMethod, {
          annotationSoftware: groupBy?.annotationSoftware ?? undefined,
          methodType: groupBy?.methodType ?? undefined,
          count: 0,
          methodLinks: [],
        })
      }
      if (groupBy?.methodLinks != null) {
        annotationMethodToMetadata.get(annotationMethod)!.methodLinks.push({
          name: groupBy.methodLinks.name ?? undefined,
          linkType: groupBy.methodLinks.linkType ?? undefined,
          link: groupBy.methodLinks.link ?? undefined,
        })
      }
    }
    // Populate counts:
    for (const aggregate of v2.depositions[0]?.annotationMethodCounts
      ?.aggregate ?? []) {
      const annotationMethod = aggregate.groupBy?.annotationMethod
      if (annotationMethod == null) {
        continue
      }
      if (annotationMethodToMetadata.has(annotationMethod)) {
        annotationMethodToMetadata.get(annotationMethod)!.count =
          aggregate.count ?? 0
      }
    }
    // Convert to sorted array:
    return [...annotationMethodToMetadata.entries()]
      .map(([annotationMethod, metadata]) => ({
        annotationMethod,
        annotationSoftware: metadata.annotationSoftware,
        count: metadata.count,
        methodType: metadata.methodType,
        methodLinks: metadata.methodLinks,
      }))
      .sort(
        (annotationMethodA, annotationMethodB) =>
          METHOD_TYPE_ORDER.indexOf(
            annotationMethodA.methodType ?? Annotation_Method_Type_Enum.Manual,
          ) -
          METHOD_TYPE_ORDER.indexOf(
            annotationMethodB.methodType ?? Annotation_Method_Type_Enum.Manual,
          ),
      )
  }, [v2.depositions])

  return {
    annotationMethods,
    annotations,
    tomograms,
    allRuns: v2.allRuns ?? [],
    datasets: v2.datasets ?? [],
    deposition: v2.depositions[0],

    annotationsCount:
      v2.annotationsCount.aggregate?.reduce(
        (total, node) => total + (node.count ?? 0),
        0,
      ) ?? 0,

    tomogramsCount:
      v2.tomogramsCount.aggregate?.reduce(
        (total, node) => total + (node.count ?? 0),
        0,
      ) ?? 0,
  }
}
