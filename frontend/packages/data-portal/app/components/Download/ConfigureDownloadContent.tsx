import { ModalSubtitle } from 'app/components/ModalSubtitle'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'

import { ConfigureAnnotationDownloadContent } from './ConfigureAnnotationDownloadContent'
import { ConfigureTomogramDownloadContent } from './ConfigureTomogramDownloadContent'

export function ConfigureDownloadContent() {
  const { t } = useI18n()
  const { datasetTitle, runName, objectName } = useDownloadModalContext()
  const { annotationId, objectShapeType } = useDownloadModalQueryParamState()

  return (
    <>
      <ModalSubtitle label={t('dataset')} value={datasetTitle} />
      {runName && <ModalSubtitle label={t('run')} value={runName} />}
      {annotationId && (
        <ModalSubtitle label={t('annotationId')} value={annotationId} />
      )}
      {objectName && (
        <ModalSubtitle label={t('objectName')} value={objectName} />
      )}
      {objectShapeType && (
        <ModalSubtitle label={t('objectShapeType')} value={objectShapeType} />
      )}

      <p className="mt-sds-xl text-sds-body-m leading-sds-body-m font-semibold">
        {t('selectDownload')}
      </p>

      {annotationId ? (
        <ConfigureAnnotationDownloadContent />
      ) : (
        <ConfigureTomogramDownloadContent />
      )}
    </>
  )
}
