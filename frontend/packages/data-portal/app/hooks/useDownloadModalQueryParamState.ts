import { useCallback, useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { DownloadConfig, DownloadStep, DownloadTab } from 'app/types/download'

import { stringParam, useQueryParam, useQueryParams } from './useQueryParam'

export function useDownloadModalQueryParamState() {
  const [downloadTab, setDownloadTab] = useQueryParam<DownloadTab>(
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

  const [, setDownloadParams] = useQueryParams({
    [QueryParams.DownloadConfig]: stringParam<DownloadConfig>(),
    [QueryParams.DownloadStep]: stringParam<DownloadStep>(),
    [QueryParams.DownloadTab]: stringParam<DownloadTab>(),
    [QueryParams.TomogramProcessing]: stringParam(),
    [QueryParams.TomogramSampling]: stringParam(),
  })

  const openDatasetDownloadModal = useCallback(
    () => setDownloadTab(DownloadTab.AWS),
    [setDownloadTab],
  )

  const openTomogramDownloadModal = useCallback(
    () => setDownloadStep(DownloadStep.Configure),
    [setDownloadStep],
  )

  const closeDownloadModal = useCallback(
    () => setDownloadParams(null),
    [setDownloadParams],
  )

  const configureDownload = useCallback(
    () =>
      setDownloadParams((prev) => ({
        [QueryParams.DownloadTab]:
          prev?.[QueryParams.DownloadConfig] === DownloadConfig.Tomogram
            ? DownloadTab.Download
            : DownloadTab.AWS,

        [QueryParams.DownloadStep]: DownloadStep.Download,
      })),
    [setDownloadParams],
  )

  const goBackToConfigure = useCallback(
    () =>
      setDownloadParams({
        [QueryParams.DownloadStep]: DownloadStep.Configure,
        [QueryParams.DownloadTab]: null,
      }),
    [setDownloadParams],
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
    goBackToConfigure,
    isModalOpen,
    openDatasetDownloadModal,
    openTomogramDownloadModal,
    setAllAnnotationsConfig,
    setDownloadConfig,
    setDownloadParams,
    setDownloadStep,
    setDownloadTab,
    setTomogramConfig,
    setTomogramProcessing,
    setTomogramSampling,
    tomogramProcessing,
    tomogramSampling,
  }
}
