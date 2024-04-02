import { isNumber } from 'lodash-es'
import prettyBytes from 'pretty-bytes'
import { ComponentType, useMemo } from 'react'

import { ModalSubtitle } from 'app/components/ModalSubtitle'
import { TabData, Tabs } from 'app/components/Tabs'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadConfig, DownloadTab } from 'app/types/download'

import { APIDownloadTab } from './APIDownloadTab'
import { AWSDownloadTab } from './AWSDownloadTab'
import { CurlDownloadTab } from './CurlDownloadTab'
import { DirectDownloadTab } from './DirectDownloadTab'
import { FILE_FORMAT_LABEL_I18N } from './FileFormatDropdown'

const DOWNLOAD_TAB_MAP: Record<DownloadTab, ComponentType> = {
  api: APIDownloadTab,
  aws: AWSDownloadTab,
  curl: CurlDownloadTab,
  download: DirectDownloadTab,
}

export function DownloadOptionsContent() {
  const { t } = useI18n()
  const {
    downloadTab,
    setDownloadTab,
    downloadConfig,
    tomogramProcessing,
    tomogramSampling,
    annotationId,
    fileFormat,
    objectShapeType,
  } = useDownloadModalQueryParamState()

  const downloadTabs = useMemo<TabData<DownloadTab>[]>(
    () => [
      ...(downloadConfig === DownloadConfig.Tomogram ||
      (annotationId && fileFormat !== 'zarr')
        ? [
            { value: DownloadTab.Download, label: t('directDownload') },
            { value: DownloadTab.Curl, label: t('viaCurl') },
          ]
        : []),

      { value: DownloadTab.AWS, label: t('viaAwsS3') },
      { value: DownloadTab.API, label: t('viaApi') },
    ],
    [annotationId, downloadConfig, fileFormat, t],
  )

  const { datasetId, datasetTitle, fileSize, objectName, runId, runName } =
    useDownloadModalContext()

  if (!downloadTab) {
    return null
  }

  const DownloadTabContent = DOWNLOAD_TAB_MAP[downloadTab]

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
      {fileFormat && (
        <ModalSubtitle
          label={t('fileFormat')}
          value={t(FILE_FORMAT_LABEL_I18N[fileFormat])}
        />
      )}
      {tomogramSampling && (
        <ModalSubtitle label={t('tomogramSampling')} value={tomogramSampling} />
      )}
      {tomogramProcessing && (
        <ModalSubtitle
          label={t('tomogramProcessing')}
          value={tomogramProcessing}
        />
      )}
      {isNumber(fileSize) && (
        <ModalSubtitle label={t('fileSize')} value={prettyBytes(fileSize)} />
      )}
      {downloadConfig === DownloadConfig.AllAnnotations && (
        <ModalSubtitle label={t('annotations')} value={t('all')} />
      )}

      <p className="font-semibold text-sds-body-m leading-sds-body-m mt-sds-xl">
        {t('selectDownloadMethod')}:
      </p>

      {downloadTab && (
        <div className="border-b-2 border-sds-gray-200">
          <Tabs
            onChange={(tab) =>
              setDownloadTab({
                tab,
                datasetId,
                runId,
              })
            }
            tabs={downloadTabs}
            value={downloadTab}
          />
        </div>
      )}

      <DownloadTabContent />
    </>
  )
}
