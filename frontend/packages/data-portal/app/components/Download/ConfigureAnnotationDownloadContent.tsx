import { useMemo } from 'react'

import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'

import { FileFormatDropdown } from './FileFormatDropdown'

export function ConfigureAnnotationDownloadContent() {
  const { objectShapeType } = useDownloadModalQueryParamState()
  const { annotationToDownload } = useDownloadModalContext()

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
    </>
  )
}
