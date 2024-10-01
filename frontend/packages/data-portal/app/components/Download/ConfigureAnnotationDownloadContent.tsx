import { useMemo } from 'react'

import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'

import { AnnotationAlignmentCallout } from './AnnotationAlignmentCallout'
import { FileFormatDropdown } from './FileFormatDropdown'

export function ConfigureAnnotationDownloadContent() {
  const { objectShapeType } = useDownloadModalQueryParamState()
  const { annotationToDownload, allTomograms } = useDownloadModalContext()

  const fileFormats = useMemo<string[]>(
    () =>
      annotationToDownload?.files
        .filter((annotation) => annotation.shape_type === objectShapeType)
        .map((annotation) => annotation.format) ?? [],
    [annotationToDownload?.files, objectShapeType],
  )

  return (
    <>
      <FileFormatDropdown className="pt-sds-l" fileFormats={fileFormats} />
      <AnnotationAlignmentCallout
        // TODO(bchu): Use alignment ID when annotation query is migrated.
        alignmentId={0}
        initialState="open"
        // TODO(bchu): Filter by tomograms that do not have the same annotation ID.
        misalignedTomograms={allTomograms ?? []}
      />
    </>
  )
}
