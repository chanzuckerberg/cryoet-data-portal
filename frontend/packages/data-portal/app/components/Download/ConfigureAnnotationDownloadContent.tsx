import { useMemo } from 'react'

import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'

import { AnnotationAlignmentCallout } from './AnnotationAlignmentCallout'
import { FileFormatDropdown } from './FileFormatDropdown'
import { useRunById } from 'app/hooks/useRunById'
import { AnnotationFileEdge } from 'app/__generated_v2__/graphql'
import { DeepPartial } from 'utility-types'

export function ConfigureAnnotationDownloadContent() {
  const { objectShapeType, fileFormat } = useDownloadModalQueryParamState()
  const { annotationToDownload, allTomograms } = useDownloadModalContext()

  const fileFormats = useMemo<string[]>(
    () =>
      annotationToDownload?.files
        .filter((annotation) => annotation.shape_type === objectShapeType)
        .map((annotation) => annotation.format) ?? [],
    [annotationToDownload?.files, objectShapeType],
  )

  const { annotationShapes } = useRunById()

  const isMatchingFormat = (file: DeepPartial<AnnotationFileEdge>) =>
    file?.node?.format === fileFormat

  const alignmentId =
    annotationShapes
      .find(
        (shape) =>
          shape.annotation?.id === annotationToDownload?.id &&
          shape.shapeType === objectShapeType &&
          shape.annotationFiles.edges.some(isMatchingFormat),
      )
      ?.annotationFiles.edges.find(isMatchingFormat)?.node.alignmentId ?? 0

  return (
    <>
      <FileFormatDropdown className="pt-sds-l" fileFormats={fileFormats} />
      <AnnotationAlignmentCallout
        alignmentId={alignmentId}
        initialState="open"
        misalignedTomograms={(allTomograms ?? []).filter(
          (tomogram) => tomogram.alignment?.id !== alignmentId,
        )}
      />
    </>
  )
}
