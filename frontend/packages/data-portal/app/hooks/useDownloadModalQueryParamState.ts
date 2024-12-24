import { useCallback, useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { DownloadConfig, DownloadStep, DownloadTab } from 'app/types/download'
import { removeNullishValues } from 'app/utils/object'

import {
  Events,
  PlausibleDownloadModalPayload,
  usePlausible,
} from './usePlausible'
import { stringParam, useQueryParam, useQueryParams } from './useQueryParam'

export function useDownloadModalQueryParamState() {
  const plausible = usePlausible()

  const [downloadTab, setDownloadTabState] = useQueryParam<DownloadTab>(
    QueryParams.DownloadTab,
  )

  const [downloadStep, setDownloadStep] = useQueryParam<DownloadStep>(
    QueryParams.DownloadStep,
  )

  const [downloadConfig, setDownloadConfig] = useQueryParam<DownloadConfig>(
    QueryParams.DownloadConfig,
  )

  const [annotationId, setAnnotationId] = useQueryParam<string>(
    QueryParams.AnnotationId,
  )

  const [annotationName, setAnnotationName] = useQueryParam<string>(
    QueryParams.AnnotationName,
  )

  const [tomogramId, setTomogramId] = useQueryParam<string>(
    QueryParams.DownloadTomogramId,
  )

  const [referenceTomogramId, setReferenceTomogramId] = useQueryParam<string>(
    QueryParams.ReferenceTomogramId,
  )

  const [objectShapeType, setObjectShapeType] = useQueryParam<string>(
    QueryParams.ObjectShapeType,
  )

  const [fileFormat, setFileFormat] = useQueryParam<string>(
    QueryParams.FileFormat,
  )

  const [, setDownloadParams] = useQueryParams({
    [QueryParams.DownloadConfig]: stringParam<DownloadConfig>(),
    [QueryParams.DownloadStep]: stringParam<DownloadStep>(),
    [QueryParams.DownloadTab]: stringParam<DownloadTab>(),
    [QueryParams.DownloadTomogramId]: stringParam(),
    [QueryParams.AnnotationId]: stringParam(),
    [QueryParams.ReferenceTomogramId]: stringParam(),
    [QueryParams.ObjectShapeType]: stringParam(),
    [QueryParams.FileFormat]: stringParam(),
    [QueryParams.AnnotationName]: stringParam(),
  })

  const getPlausiblePayload = useCallback(
    ({
      datasetId,
      fileSize,
      runId,
      ...rest
    }: PlausibleDownloadModalPayload = {}) =>
      removeNullishValues({
        datasetId,
        fileSize,
        runId,
        annotationId: rest.annotationId ?? annotationId,
        objectShapeType: rest.objectShapeType ?? objectShapeType,
        step: rest.step ?? downloadStep ?? DownloadStep.Download,
        config: rest.config ?? downloadConfig,
        tab: rest.tab ?? downloadTab,
        fileFormat: rest.fileFormat ?? fileFormat,
      }) as PlausibleDownloadModalPayload,
    [
      annotationId,
      downloadConfig,
      downloadStep,
      downloadTab,
      fileFormat,
      objectShapeType,
    ],
  )

  const setDownloadTab = useCallback(
    (payload: PlausibleDownloadModalPayload<{ tab: DownloadTab }>) => {
      plausible(Events.ClickDownloadTab, getPlausiblePayload(payload))
      setDownloadTabState(payload.tab)
    },
    [getPlausiblePayload, plausible, setDownloadTabState],
  )

  const openDatasetDownloadModal = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(
        Events.OpenDownloadModal,
        getPlausiblePayload({
          ...payload,
          tab: DownloadTab.AWS,
        }),
      )

      setDownloadTabState(DownloadTab.AWS)
    },
    [getPlausiblePayload, plausible, setDownloadTabState],
  )

  const openRunDownloadModal = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(
        Events.OpenDownloadModal,
        getPlausiblePayload({
          ...payload,
          step: DownloadStep.Configure,
        }),
      )

      setDownloadStep(DownloadStep.Configure)
    },
    [getPlausiblePayload, plausible, setDownloadStep],
  )

  const openAnnotationDownloadModal = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(
        Events.OpenDownloadModal,
        getPlausiblePayload({
          ...payload,
          step: DownloadStep.Configure,
        }),
      )

      setDownloadParams({
        [QueryParams.DownloadStep]: DownloadStep.Configure,
        [QueryParams.AnnotationId]: String(payload.annotationId),
        [QueryParams.ReferenceTomogramId]: String(payload.referenceTomogramId),
        [QueryParams.ObjectShapeType]: payload.objectShapeType,
        [QueryParams.FileFormat]: payload.fileFormat,
        [QueryParams.AnnotationName]: payload.annotationName,
      })
    },
    [getPlausiblePayload, plausible, setDownloadParams],
  )

  const openTomogramDownloadModal = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(
        Events.OpenDownloadModal,
        getPlausiblePayload({
          ...payload,
          step: DownloadStep.Configure,
        }),
      )

      setDownloadParams({
        [QueryParams.DownloadStep]: DownloadStep.Configure,
        [QueryParams.DownloadConfig]: DownloadConfig.Tomogram,
        [QueryParams.DownloadTomogramId]: String(payload.tomogramId),
        [QueryParams.FileFormat]: 'mrc',
      })
    },
    [getPlausiblePayload, plausible, setDownloadParams],
  )

  const closeDownloadModal = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(Events.CloseDownloadModal, getPlausiblePayload(payload))
      setDownloadParams(null)
    },
    [getPlausiblePayload, plausible, setDownloadParams],
  )

  const configureDownload = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(Events.ClickNextToDownloadOptions, getPlausiblePayload(payload))

      setDownloadParams({
        [QueryParams.DownloadStep]: DownloadStep.Download,
      })
    },
    [getPlausiblePayload, plausible, setDownloadParams],
  )

  const goBackToConfigure = useCallback(
    (payload: PlausibleDownloadModalPayload) => {
      plausible(
        Events.ClickBackToConfigureDownload,
        getPlausiblePayload(payload),
      )

      setDownloadParams({
        [QueryParams.DownloadStep]: DownloadStep.Configure,
        [QueryParams.DownloadTab]: null,
      })
    },
    [getPlausiblePayload, plausible, setDownloadParams],
  )

  const setTomogramConfig = useCallback(
    (id?: string) =>
      setDownloadParams({
        [QueryParams.DownloadConfig]: DownloadConfig.Tomogram,
        [QueryParams.DownloadTomogramId]: id,
        [QueryParams.FileFormat]: 'mrc',
      }),
    [setDownloadParams],
  )

  const setAllAnnotationsConfig = useCallback(
    () =>
      setDownloadParams({
        [QueryParams.DownloadConfig]: DownloadConfig.AllAnnotations,
        [QueryParams.FileFormat]: null,
      }),
    [setDownloadParams],
  )

  const isModalOpen = useMemo(
    () => !!downloadTab || !!downloadStep || !!downloadConfig,
    [downloadConfig, downloadStep, downloadTab],
  )

  return {
    annotationId,
    tomogramId,
    referenceTomogramId,
    closeDownloadModal,
    configureDownload,
    downloadConfig,
    downloadStep,
    downloadTab,
    fileFormat,
    getPlausiblePayload,
    goBackToConfigure,
    isModalOpen,
    objectShapeType,
    openAnnotationDownloadModal,
    openTomogramDownloadModal,
    openDatasetDownloadModal,
    openRunDownloadModal,
    setAllAnnotationsConfig,
    setAnnotationId,
    setTomogramId,
    setReferenceTomogramId,
    setDownloadConfig,
    setDownloadParams,
    setDownloadStep,
    setDownloadTab,
    setFileFormat,
    setObjectShapeType,
    setTomogramConfig,
    annotationName,
    setAnnotationName,
  }
}
