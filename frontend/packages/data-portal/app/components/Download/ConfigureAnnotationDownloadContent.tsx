import { useMemo } from 'react'

import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { I18n } from '../I18n'
import { FileFormatDropdown } from './FileFormatDropdown'
import { TomogramSelector } from './Tomogram/TomogramSelector'

export function ConfigureAnnotationDownloadContent() {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')
  const { t } = useI18n()
  const { objectShapeType, referenceTomogramId, setReferenceTomogramId } =
    useDownloadModalQueryParamState()
  const { annotationToDownload, allTomograms = [] } = useDownloadModalContext()

  const fileFormats = useMemo<string[]>(
    () =>
      annotationToDownload?.files
        .filter((annotation) => annotation.shape_type === objectShapeType)
        .map((annotation) => annotation.format) ?? [],
    [annotationToDownload?.files, objectShapeType],
  )

  return (
    <>
      {multipleTomogramsEnabled && (
        <TomogramSelector
          title={t('referenceTomogram')}
          tooltip={<I18n i18nKey="selectTheTomogramToReferenceWith" />}
          className="pt-sds-m"
          selectedTomogram={allTomograms.find(
            (tomogram) => tomogram.id.toString() === referenceTomogramId,
          )}
          allTomograms={allTomograms}
          onSelectTomogramId={setReferenceTomogramId}
        />
      )}
      <FileFormatDropdown className="pt-sds-l" fileFormats={fileFormats} />
    </>
  )
}
