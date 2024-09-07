import { useCallback, useMemo } from 'react'
import { match, P } from 'ts-pattern'

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

  const [tomogramProcessing, setTomogramProcessing] = useQueryParam<string>(
    QueryParams.TomogramProcessing,
  )
  const [tomogramSampling, setTomogramSampling] = useQueryParam<string>(
    QueryParams.TomogramSampling,
  )

  const [annotationId, setAnnotationId] = useQueryParam<string>(
    QueryParams.AnnotationId,
  )

  const [tomogramId, setTomogramId] = useQueryParam<string>(
    QueryParams.DownloadTomogramId,
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
    [QueryParams.TomogramProcessing]: stringParam(),
    [QueryParams.TomogramSampling]: stringParam(),
    [QueryParams.AnnotationId]: stringParam(),
    [QueryParams.ObjectShapeType]: stringParam(),
    [QueryParams.FileFormat]: stringParam(),
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
        tomogramProcessing: rest.tomogramProcessing ?? tomogramProcessing,
        tomogramSampling: rest.tomogramSampling ?? tomogramSampling,
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
      tomogramProcessing,
      tomogramSampling,
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
        [QueryParams.ObjectShapeType]: payload.objectShapeType,
        [QueryParams.FileFormat]: payload.fileFormat,
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

      setDownloadParams((prev) => ({
        [QueryParams.DownloadTab]: match({
          annotationId: prev?.[QueryParams.AnnotationId],
          fileFormat: prev?.[QueryParams.FileFormat],
        })
          .with(
            { fileFormat: P.string.and(P.not('zarr')) },
            () => DownloadTab.Download,
          )
          .otherwise(() => DownloadTab.AWS),

        [QueryParams.DownloadStep]: DownloadStep.Download,
      }))
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

  /** @deprecated */
  const setTomogramConfig = useCallback(
    (initialTomogramSampling: string, initialTomogramProcessing: string) =>
      setDownloadParams({
        [QueryParams.DownloadConfig]: DownloadConfig.Tomogram,
        [QueryParams.TomogramSampling]: initialTomogramSampling,
        [QueryParams.TomogramProcessing]: initialTomogramProcessing,
        [QueryParams.FileFormat]: 'mrc',
      }),
    [setDownloadParams],
  )

  const setTomogramConfigNew = useCallback(
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
        [QueryParams.TomogramSampling]: null,
        [QueryParams.TomogramProcessing]: null,
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
    setDownloadConfig,
    setDownloadParams,
    setDownloadStep,
    setDownloadTab,
    setFileFormat,
    setObjectShapeType,
    setTomogramConfig,
    setTomogramConfigNew,
    setTomogramProcessing,
    setTomogramSampling,
    tomogramProcessing,
    tomogramSampling,
  }
}
