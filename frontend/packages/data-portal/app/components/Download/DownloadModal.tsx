import { Button, Dialog, DialogActions, Icon } from '@czi-sds/components'
import { useCallback, useMemo } from 'react'
import { match } from 'ts-pattern'

import {
  DownloadModalContext,
  DownloadModalContextValue,
  useDownloadModalContext,
} from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { PlausibleDownloadModalPayload } from 'app/hooks/usePlausible'
import { DownloadStep } from 'app/types/download'
import { cns } from 'app/utils/cns'

import { ConfigureDownloadContent } from './ConfigureDownloadContent'
import { DownloadOptionsContent } from './DownloadOptionsContent'

function DownloadModalContent() {
  const { t } = useI18n()
  const {
    annotationId,
    closeDownloadModal,
    configureDownload,
    downloadConfig,
    downloadStep,
    fileFormat,
    goBackToConfigure,
    isModalOpen,
  } = useDownloadModalQueryParamState()
  const { datasetId, runId, type, fileSize } = useDownloadModalContext()

  const plausiblePayload = useMemo<PlausibleDownloadModalPayload>(
    () => ({
      datasetId,
      fileSize,
      runId,
    }),
    [datasetId, fileSize, runId],
  )

  const closeModal = useCallback(
    () => closeDownloadModal(plausiblePayload),
    [closeDownloadModal, plausiblePayload],
  )

  const modalData = useMemo(() => {
    const hasMultipleSteps = ['runs', 'annotation'].includes(type)

    return match({ downloadStep, type })
      .with(
        { type: 'dataset' },
        { type: 'runs', downloadStep: DownloadStep.Download },
        { type: 'annotation', downloadStep: DownloadStep.Download },
        () => ({
          buttonDisabled: false,
          buttonText: t('close'),
          content: <DownloadOptionsContent />,
          onClick: closeModal,
          showBackButton: hasMultipleSteps,
          subtitle: hasMultipleSteps
            ? t('stepCount', { count: 2, max: 2 })
            : null,
          title:
            type === 'dataset'
              ? t('downloadDatasetTitle')
              : t('downloadOptions'),
        }),
      )
      .otherwise(() => ({
        buttonDisabled: annotationId ? !fileFormat : !downloadConfig,
        buttonText: t('next'),
        content: <ConfigureDownloadContent />,
        onClick: () => configureDownload(plausiblePayload),
        showBackButton: false,
        subtitle: t('stepCount', { count: 1, max: 2 }),
        title: t('configureDownload'),
      }))
  }, [
    annotationId,
    closeModal,
    configureDownload,
    downloadConfig,
    downloadStep,
    fileFormat,
    plausiblePayload,
    t,
    type,
  ])

  return (
    <Dialog
      classes={{
        paper:
          '!max-w-[600px] border border-light-sds-color-primitive-gray-100',
      }}
      onClose={closeModal}
      open={!!isModalOpen}
      canClickOutsideClose={false}
    >
      <div className="flex justify-between">
        <div className="flex-col gap-sds-xxs py-sds-xxs">
          {modalData.subtitle && (
            <p className="text-light-sds-color-primitive-gray-500 text-sds-body-xs-400-wide leading-sds-body-xs">
              {modalData.subtitle}
            </p>
          )}
          <h2 className="text-sds-header-xl-600-wide leading-sds-header-xl font-semibold">
            {modalData.title}
          </h2>
        </div>

        <div>
          <button onClick={closeModal} type="button">
            <Icon
              className={cns(
                'transition-colors',
                '!text-light-sds-color-semantic-base-ornament-secondary',
                'hover:!text-light-sds-color-semantic-base-ornament-secondary-hover',
                'active:!text-light-sds-color-semantic-base-ornament-secondary-hover',
              )}
              sdsIcon="XMark"
              sdsSize="l"
            />
          </button>
        </div>
      </div>

      {modalData.content}

      <DialogActions>
        {modalData.showBackButton && (
          <Button
            onClick={goBackToConfigure}
            sdsStyle="rounded"
            sdsType="secondary"
          >
            {t('back')}
          </Button>
        )}

        <Button
          disabled={modalData.buttonDisabled}
          onClick={modalData.onClick}
          sdsStyle="rounded"
          sdsType="primary"
        >
          {modalData.buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function DownloadModal({ type, ...props }: DownloadModalContextValue) {
  const contextValue = useMemo<DownloadModalContextValue>(
    () => ({
      type,
      ...props,
    }),
    [props, type],
  )

  return (
    <DownloadModalContext.Provider value={contextValue}>
      <DownloadModalContent />
    </DownloadModalContext.Provider>
  )
}
