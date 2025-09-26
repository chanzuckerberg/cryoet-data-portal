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
    id: number // internal use only, for sorting
    name?: string
    linkType?: Annotation_Method_Link_Type_Enum
    link?: string
  }>
}

export interface TomogramMethodMetadata {
  count: number
  voxelSpacing: string
  reconstructionMethod: string
  processing: string
  ctfCorrected: boolean
}

export interface AcquisitionMethodMetadata {
  count: number
  microscope: string
  camera: string
  tiltingScheme: string
  pixelSize: string
  energyFilter: string
  electronOptics: string
  phasePlate: string
}

export interface ExperimentalConditionsMethodMetadata {
  count: number
  sampleType: string
  samplePreparation: string
  gridPreparation: string
  pixelSize: string
}

export function useDepositionById() {
  const { v2, expandedData, annotations, tomograms } = useTypedLoaderData<{
    v2: GetDepositionBaseDataV2Query
    expandedData?: GetDepositionExpandedDataV2Query
    annotations?: GetDepositionAnnotationsQuery
    tomograms?: GetDepositionTomogramsQuery
  }>()

  const annotationMethods: AnnotationMethodMetadata[] = useMemo(() => {
    const annotationMethodToMetadata = new Map<
      string,
      Omit<AnnotationMethodMetadata, 'annotationMethod'>
    >()
    // To preserve original ordering of annotations' method links, we track the minimum id for each method link of each annotation method
    const methodLinkToId = new Map<string, number>()
    for (const { node } of v2.depositions[0]?.annotations?.edges ?? []) {
      if (!node) continue
      for (const methodLinkEdge of node.methodLinks?.edges ?? []) {
        const { link, name, linkType, id } = methodLinkEdge.node
        const key = JSON.stringify([node?.annotationMethod, link, name, linkType])
        if (!methodLinkToId.has(key) || id < methodLinkToId.get(key)!) {
          methodLinkToId.set(key, id)
        }
      }
    }

    // Parse deposition annotations
    for (const { node } of v2.depositions[0]?.annotations?.edges ?? []) {
      const annotationMethod = node?.annotationMethod
      if (annotationMethod == null) continue

      if (!annotationMethodToMetadata.has(annotationMethod)) {
        annotationMethodToMetadata.set(annotationMethod, {
          annotationSoftware: node?.annotationSoftware ?? undefined,
          methodType: node?.methodType ?? undefined,
          count: 0,
          methodLinks: [],
        })
      }

      const meta = annotationMethodToMetadata.get(annotationMethod)!

      // Collect all method link metadata
      for (const methodLinkEdge of node.methodLinks?.edges ?? []) {
        const { id, link, name, linkType } = methodLinkEdge.node
        meta.methodLinks.push({
          id,
          name: name ?? undefined,
          linkType: linkType ?? undefined,
          link: link ?? undefined,
        })
      }
    }

    // Deduplicate and sort method links
    for (const [method, metadata] of annotationMethodToMetadata) {
      const unique = new Map<string, (typeof metadata.methodLinks)[0]>()
      for (const link of metadata.methodLinks) {
        const key = JSON.stringify([method, link.link, link.name, link.linkType])
        // Keep only the smallest id per unique key (to preserve original ordering)
        if (!unique.has(key) || link.id < unique.get(key)!.id) {
          unique.set(key, link)
        }
      }

      metadata.methodLinks = Array.from(unique.values()).sort(
        (a, b) => a.id - b.id,
      )
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

  const tomogramMethods: TomogramMethodMetadata[] = useMemo(() => {
    const tomogramMethodsData =
      v2.depositions[0]?.tomogramMethodCounts?.aggregate ?? []

    return tomogramMethodsData
      .map((aggregate) => ({
        count: aggregate.count ?? 0,
        voxelSpacing: aggregate.groupBy?.voxelSpacing?.toString() ?? '--',
        reconstructionMethod: aggregate.groupBy?.reconstructionMethod ?? '--',
        processing: aggregate.groupBy?.processing ?? '--',
        ctfCorrected: aggregate.groupBy?.ctfCorrected ?? false,
      }))
      .sort((a, b) => b.count - a.count)
  }, [v2.depositions])

  const acquisitionMethods: AcquisitionMethodMetadata[] = useMemo(() => {
    const acquisitionMethodsData =
      v2.depositions[0]?.acquisitionMethodCounts?.aggregate ?? []

    return acquisitionMethodsData
      .map((aggregate) => ({
        count: aggregate.count ?? 0,
        microscope: aggregate.groupBy?.microscopeModel ?? '--',
        camera: aggregate.groupBy?.cameraModel ?? '--',
        tiltingScheme: aggregate.groupBy?.tiltingScheme ?? '--',
        pixelSize: aggregate.groupBy?.pixelSpacing?.toString() ?? '--',
        energyFilter: aggregate.groupBy?.microscopeEnergyFilter ?? '--',
        electronOptics: '--',
        phasePlate: aggregate.groupBy?.microscopePhasePlate ?? '--',
      }))
      .sort((a, b) => b.count - a.count)
  }, [v2.depositions])

  const experimentalConditions: ExperimentalConditionsMethodMetadata[] =
    useMemo(() => {
      const experimentalConditionsData =
        v2.experimentalConditionsCounts?.aggregate ?? []

      return experimentalConditionsData
        .map((aggregate) => ({
          count: aggregate.count ?? 0,
          sampleType: aggregate.groupBy?.dataset?.sampleType ?? '--',
          samplePreparation:
            aggregate.groupBy?.dataset?.samplePreparation ?? '--',
          gridPreparation: aggregate.groupBy?.dataset?.gridPreparation ?? '--',
          pixelSize: '--',
        }))
        .sort((a, b) => b.count - a.count)
    }, [v2.experimentalConditionsCounts])

  return {
    annotationMethods,
    tomogramMethods,
    acquisitionMethods,
    experimentalConditions,
    annotations,
    tomograms,
    allRuns: expandedData?.allRuns,
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

    filteredAnnotationsCount:
      v2.filteredAnnotationsCount.aggregate?.reduce(
        (total, node) => total + (node.count ?? 0),
        0,
      ) ?? 0,

    filteredTomogramsCount:
      v2.filteredTomogramsCount.aggregate?.reduce(
        (total, node) => total + (node.count ?? 0),
        0,
      ) ?? 0,
  }
}

// Legacy hook for components that need legacy data (datasets)
export function useDepositionByIdLegacy() {
  const { v2, legacyData } = useTypedLoaderData<{
    v2: GetDepositionBaseDataV2Query
    legacyData?: GetDepositionLegacyDataV2Query
    annotations?: GetDepositionAnnotationsQuery
    tomograms?: GetDepositionTomogramsQuery
  }>()

  return {
    datasets: legacyData?.datasets,
    deposition: v2.depositions[0],
  }
}
