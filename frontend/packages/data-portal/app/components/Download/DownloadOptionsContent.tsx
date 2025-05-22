import { Callout } from '@czi-sds/components'
import { isNumber, startCase } from 'lodash-es'
import prettyBytes from 'pretty-bytes'
import { useMemo } from 'react'

import { ModalSubtitle } from 'app/components/ModalSubtitle'
import { Tabs } from 'app/components/Tabs'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadConfig } from 'app/types/download'
import { getTomogramName } from 'app/utils/tomograms'

import { I18n } from '../I18n'
import { AnnotationAlignmentCallout } from './AnnotationAlignmentCallout'
import { FILE_FORMAT_LABEL_I18N } from './FileFormatDropdown'
import { DOWNLOAD_TAB_MAP } from './types'
import { buildSubtitles, getDownloadTabs } from './utils'

export function DownloadOptionsContent() {
  const { t } = useI18n()
  const {
    downloadTab,
    setDownloadTab,
    downloadConfig,
    tomogramSampling,
    annotationId,
    referenceTomogramId,
    fileFormat,
    objectShapeType,
    annotationName,
  } = useDownloadModalQueryParamState()
  const {
    allTomograms,
    datasetId,
    datasetTitle,
    datasetContentsSummary,
    fileSize,
    objectName,
    runId,
    runName,
    annotationShapeToDownload,
    tomogramToDownload,
    totalRuns,
    type,
  } = useDownloadModalContext()

  const downloadTabs = useMemo(
    () => getDownloadTabs(type, fileFormat, t),
    [type, fileFormat, t],
  )
  const selectedTab =
    downloadTab ?? downloadTabs.find((tab) => !tab.disabled)!.value // Default to first enabled tab
  const referenceTomogram = allTomograms?.find(
    (tomogram) => tomogram.id.toString() === referenceTomogramId,
  )
  const annotationFileAlignmentId =
    annotationShapeToDownload?.annotationFiles.edges.find(
      (file) => file.node.format === fileFormat,
    )?.node.alignmentId ?? undefined
  const DownloadTabContent = DOWNLOAD_TAB_MAP[selectedTab]

  const subtitles = buildSubtitles(
    datasetTitle && { label: t('datasetName'), value: datasetTitle },
    runName && { label: t('runName'), value: runName },
    tomogramToDownload && {
      label: t('tomogramName'),
      value: getTomogramName(tomogramToDownload),
    },
    tomogramToDownload && {
      label: t('tomogramId'),
      value: `${IdPrefix.Tomogram}-${tomogramToDownload.id}`,
    },
    tomogramToDownload && {
      label: t('tomogramSampling'),
      value: `${t('unitAngstrom', { value: tomogramSampling })}, (${
        tomogramToDownload.sizeX
      }, ${tomogramToDownload.sizeY}, ${tomogramToDownload.sizeZ})px`,
    },
    tomogramToDownload && {
      label: t('reconstructionMethod'),
      value: startCase(tomogramToDownload.reconstructionMethod),
    },
    tomogramToDownload && {
      label: t('tomogramProcessing'),
      value: tomogramToDownload.processing,
    },
    annotationName && { label: t('annotationName'), value: annotationName },
    annotationId && { label: t('annotationId'), value: annotationId },
    objectName && { label: t('objectName'), value: objectName },
    objectShapeType && { label: t('objectShapeType'), value: objectShapeType },
    referenceTomogram && {
      label: t('referenceTomogram'),
      value: getTomogramName(referenceTomogram),
    },
    annotationFileAlignmentId && {
      label: t('alignmentId'),
      value: `${IdPrefix.Alignment}-${annotationFileAlignmentId}`,
    },
    fileFormat && {
      label: t('fileFormat'),
      value: t(FILE_FORMAT_LABEL_I18N[fileFormat]),
    },
    isNumber(fileSize) && {
      label: t('estimatedDownloadSize'),
      value: prettyBytes(fileSize),
    },
    type === 'dataset' && {
      label: t('totalRuns'),
      value: totalRuns,
    },
    type === 'dataset' && {
      label: t('frames'),
      value: datasetContentsSummary?.frames ?? '--',
    },
    type === 'dataset' && {
      label: t('tiltSeries'),
      value: datasetContentsSummary?.tiltSeries ?? '--',
    },
    type === 'dataset' && {
      label: t('ctf'),
      value: datasetContentsSummary?.ctf ?? '--',
    },
    type === 'dataset' && {
      label: t('alignment'),
      value: datasetContentsSummary?.alignment ?? '--',
    },
    type === 'dataset' && {
      label: t('tomograms'),
      value: datasetContentsSummary?.tomograms ?? '--',
    },
    type === 'dataset' && {
      label: t('annotations'),
      value: datasetContentsSummary?.annotations ?? '--',
    },
    downloadConfig === DownloadConfig.AllAnnotations && {
      label: t('annotations'),
      value: t('all'),
    },
  )

  return (
    <>
      {subtitles.map(({ label, value }) => (
        <ModalSubtitle key={label} label={label} value={value} />
      ))}

      <p className="font-semibold text-sds-body-m-400-wide leading-sds-body-m mt-sds-xl">
        {t('selectDownloadMethod')}:
      </p>

      <div className="border-b-2 border-light-sds-color-primitive-gray-200">
        <Tabs
          onChange={(tab) =>
            setDownloadTab({
              tab,
              datasetId,
              runId,
            })
          }
          tabs={downloadTabs}
          value={selectedTab}
        />
      </div>

      <DownloadTabContent />

      {annotationFileAlignmentId !== undefined ? (
        <AnnotationAlignmentCallout
          alignmentId={annotationFileAlignmentId}
          initialState="closed"
          misalignedTomograms={
            allTomograms?.filter(
              (tomogram) =>
                tomogram.alignment?.id !== annotationFileAlignmentId,
            ) ?? []
          }
        />
      ) : (
        <Callout
          intent="notice"
          className="!w-full !mt-sds-xl"
          body={<I18n i18nKey="annotationsMayRequireTransformation" />}
        />
      )}
    </>
  )
}
