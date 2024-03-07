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
import { DownloadStep } from 'app/types/download'

import { ConfigureDownloadContent } from './ConfigureDownloadContent'
import { DownloadOptionsContent } from './DownloadOptionsContent'

function DownloadModalContent() {
  const { t } = useI18n()
  const {
    closeDownloadModal,
    configureDownload,
    downloadConfig,
    downloadStep,
    goBackToConfigure,
    isModalOpen,
  } = useDownloadModalQueryParamState()
  const { datasetId, runId, type, fileSize } = useDownloadModalContext()

  const plausiblePayload = useMemo(
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

  const modalData = useMemo(
    () =>
      match({ downloadStep, type })
        .with(
          { type: 'dataset' },
          { type: 'runs', downloadStep: DownloadStep.Download },
          () => ({
            buttonDisabled: false,
            buttonText: t('close'),
            content: <DownloadOptionsContent />,
            onClick: closeModal,
            showBackButton: type === 'runs',
            title: t('downloadOptions'),
          }),
        )
        .otherwise(() => ({
          buttonDisabled: !downloadConfig,
          buttonText: t('next'),
          content: <ConfigureDownloadContent />,
          onClick: () => configureDownload(plausiblePayload),
          showBackButton: false,
          title: t('configureDownload'),
        })),
    [
      closeModal,
      configureDownload,
      downloadConfig,
      downloadStep,
      plausiblePayload,
      t,
      type,
    ],
  )

  return (
    <Dialog
      classes={{
        paper: '!max-w-[600px] border border-sds-gray-100',
      }}
      onClose={closeModal}
      open={!!isModalOpen}
      canClickOutsideClose={false}
    >
      <div className="flex justify-between">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold pt-4">
          {modalData.title}
        </h2>

        <button onClick={closeModal} type="button">
          <Icon
            sdsIcon="xMark"
            sdsSize="s"
            sdsType="iconButton"
            className="!fill-sds-gray-500"
          />
        </button>
      </div>

      {modalData.content}

      <DialogActions>
        {modalData.showBackButton && (
          <Button
            onClick={goBackToConfigure}
            sdsStyle="rounded"
            sdsType="primary"
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
