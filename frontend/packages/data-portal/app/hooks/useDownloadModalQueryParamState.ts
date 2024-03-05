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

  const [tomogramProcessing, setTomogramProcessing] = useQueryParam<string>(
    QueryParams.TomogramProcessing,
  )
  const [tomogramSampling, setTomogramSampling] = useQueryParam<string>(
    QueryParams.TomogramSampling,
  )

  const [fileFormat, setFileFormat] = useQueryParam<string>(
    QueryParams.FileFormat,
  )

  const [, setDownloadParams] = useQueryParams({
    [QueryParams.DownloadConfig]: stringParam<DownloadConfig>(),
    [QueryParams.DownloadStep]: stringParam<DownloadStep>(),
    [QueryParams.DownloadTab]: stringParam<DownloadTab>(),
    [QueryParams.TomogramProcessing]: stringParam(),
    [QueryParams.TomogramSampling]: stringParam(),
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
        step: rest.step ?? downloadStep ?? DownloadStep.Download,
        config: rest.config ?? downloadConfig,
        tab: rest.tab ?? downloadTab,
      }) as PlausibleDownloadModalPayload,
    [
      downloadConfig,
      downloadStep,
      downloadTab,
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

  const openTomogramDownloadModal = useCallback(
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
        [QueryParams.DownloadTab]:
          prev?.[QueryParams.DownloadConfig] === DownloadConfig.Tomogram
            ? DownloadTab.Download
            : DownloadTab.AWS,

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

  const setTomogramConfig = useCallback(
    (initialTomogramSampling: string, initialTomogramProcessing: string) =>
      setDownloadParams({
        [QueryParams.DownloadConfig]: DownloadConfig.Tomogram,
        [QueryParams.TomogramSampling]: initialTomogramSampling,
        [QueryParams.TomogramProcessing]: initialTomogramProcessing,
      }),
    [setDownloadParams],
  )

  const setAllAnnotationsConfig = useCallback(
    () =>
      setDownloadParams({
        [QueryParams.DownloadConfig]: DownloadConfig.AllAnnotations,
        [QueryParams.TomogramSampling]: null,
        [QueryParams.TomogramProcessing]: null,
      }),
    [setDownloadParams],
  )

  const isModalOpen = useMemo(
    () => !!downloadTab || !!downloadStep || !!downloadConfig,
    [downloadConfig, downloadStep, downloadTab],
  )

  return {
    closeDownloadModal,
    configureDownload,
    downloadConfig,
    downloadStep,
    downloadTab,
    fileFormat,
    getPlausiblePayload,
    goBackToConfigure,
    isModalOpen,
    openDatasetDownloadModal,
    openTomogramDownloadModal,
    setAllAnnotationsConfig,
    setDownloadConfig,
    setDownloadParams,
    setDownloadStep,
    setDownloadTab,
    setFileFormat,
    setTomogramConfig,
    setTomogramProcessing,
    setTomogramSampling,
    tomogramProcessing,
    tomogramSampling,
  }
}
