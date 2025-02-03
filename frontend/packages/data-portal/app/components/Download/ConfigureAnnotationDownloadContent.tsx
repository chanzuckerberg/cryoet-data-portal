import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'

import { AnnotationAlignmentCallout } from './AnnotationAlignmentCallout'
import { FileFormatDropdown } from './FileFormatDropdown'

export function ConfigureAnnotationDownloadContent() {
  const { fileFormat } = useDownloadModalQueryParamState()
  const { annotationShapeToDownload, allTomograms } = useDownloadModalContext()

  const fileFormats =
    annotationShapeToDownload?.annotationFiles.edges.map(
      (file) => file.node.format,
    ) ?? []
  const annotationFileAlignmentId =
    annotationShapeToDownload?.annotationFiles.edges.find(
      (file) => file.node.format === fileFormat,
    )?.node.alignmentId ?? undefined

  return (
    <>
      <FileFormatDropdown className="pt-sds-l" fileFormats={fileFormats} />
      {annotationFileAlignmentId !== undefined && (
        <AnnotationAlignmentCallout
          alignmentId={annotationFileAlignmentId}
          initialState="open"
          misalignedTomograms={(allTomograms ?? []).filter(
            (tomogram) => tomogram.alignment?.id !== annotationFileAlignmentId,
          )}
        />
      )}
    </>
  )
}
