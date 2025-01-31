import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import {
  Annotation_Method_Type_Enum,
  GetDepositionByIdV2Query,
} from 'app/__generated_v2__/graphql'
import { METHOD_TYPE_ORDER } from 'app/constants/methodTypes'
import { MethodLink } from 'app/types/gql/depositionPageTypes'

export function useDepositionById() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDepositionByIdV2Query
  }>()

  const annotationMethods: Array<{
    annotationMethod: string
    methodType?: Annotation_Method_Type_Enum
    methodLinks: MethodLink[]
  }> = useMemo(() => {
    const annotationMethodToMetadata = new Map<
      string,
      {
        methodType?: Annotation_Method_Type_Enum
        count: number
        methodLinks: MethodLink[]
      }
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
          methodType: groupBy?.methodType ?? undefined,
          count: 0,
          methodLinks: [],
        })
      }
      if (groupBy?.methodLinks != null) {
        annotationMethodToMetadata
          .get(annotationMethod)!
          .methodLinks.push(groupBy?.methodLinks)
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
    deposition: v2.depositions[0],
    datasets: v2.datasets,
    annotationMethods,
  }
}
