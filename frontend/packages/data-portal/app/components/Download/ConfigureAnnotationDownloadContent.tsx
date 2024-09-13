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
  const { objectShapeType, tomogramId, setTomogramId } =
    useDownloadModalQueryParamState()
  const { activeAnnotation, allTomograms = [] } = useDownloadModalContext()

  const fileFormats = useMemo<string[]>(
    () =>
      activeAnnotation?.files
        .filter((annotation) => annotation.shape_type === objectShapeType)
        .map((annotation) => annotation.format) ?? [],
    [activeAnnotation?.files, objectShapeType],
  )

  return (
    <>
      {multipleTomogramsEnabled && (
        <TomogramSelector
          title={t('referenceTomogram')}
          tooltip={<I18n i18nKey="selectTheTomogramToReferenceWith" />}
          className="pt-sds-m"
          selectedTomogram={allTomograms.find(
            (tomogram) => tomogram.id.toString() === tomogramId,
          )}
          allTomograms={allTomograms}
          onSelectTomogramId={setTomogramId}
        />
      )}
      <FileFormatDropdown className="pt-sds-l" fileFormats={fileFormats} />
    </>
  )
}
