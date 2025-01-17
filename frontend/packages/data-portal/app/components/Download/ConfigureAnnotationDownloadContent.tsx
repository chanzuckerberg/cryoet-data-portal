import { useMemo } from 'react'
import { DeepPartial } from 'utility-types'

import { AnnotationFileEdge } from 'app/__generated_v2__/graphql'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useRunById } from 'app/hooks/useRunById'

import { AnnotationAlignmentCallout } from './AnnotationAlignmentCallout'
import { FileFormatDropdown } from './FileFormatDropdown'

export function ConfigureAnnotationDownloadContent() {
  const { objectShapeType, fileFormat } = useDownloadModalQueryParamState()
  const { annotationShapeToDownload, allTomograms } = useDownloadModalContext()

  const fileFormats = useMemo<string[]>(
    () =>
      annotationShapeToDownload?.files
        .filter((annotation) => annotation.shape_type === objectShapeType)
        .map((annotation) => annotation.format) ?? [],
    [annotationShapeToDownload?.files, objectShapeType],
  )

  const { annotationShapes } = useRunById()

  const isMatchingFormat = (file: DeepPartial<AnnotationFileEdge>) =>
    file?.node?.format === fileFormat

  const alignmentId =
    annotationShapes
      .find(
        (shape) =>
          shape.annotation?.id === annotationShapeToDownload?.id &&
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
