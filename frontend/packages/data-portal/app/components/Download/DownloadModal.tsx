import { Button, Dialog, DialogActions, Icon } from '@czi-sds/components'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

import {
  DownloadModalContext,
  DownloadModalContextValue,
} from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadStep } from 'app/types/download'

import { ConfigureDownloadContent } from './ConfigureDownloadContent'
import { DownloadOptionsContent } from './DownloadOptionsContent'

export function DownloadModal({ type, ...props }: DownloadModalContextValue) {
  const { t } = useI18n()
  const {
    closeDownloadModal,
    configureDownload,
    downloadConfig,
    downloadStep,
    goBackToConfigure,
    isModalOpen,
  } = useDownloadModalQueryParamState()

  const contextValue = useMemo<DownloadModalContextValue>(
    () => ({
      type,
      ...props,
    }),
    [props, type],
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
            onClick: closeDownloadModal,
            showBackButton: type === 'runs',
            title: t('downloadOptions'),
          }),
        )
        .otherwise(() => ({
          buttonDisabled: !downloadConfig,
          buttonText: t('next'),
          content: <ConfigureDownloadContent />,
          onClick: configureDownload,
          showBackButton: false,
          title: t('configureDownload'),
        })),
    [
      closeDownloadModal,
      configureDownload,
      downloadConfig,
      downloadStep,
      t,
      type,
    ],
  )

  return (
    <DownloadModalContext.Provider value={contextValue}>
      <Dialog
        classes={{
          paper: '!max-w-[600px] border border-sds-gray-100',
        }}
        onClose={closeDownloadModal}
        open={!!isModalOpen}
      >
        <div className="flex justify-between">
          <p className="text-sds-header-xl leading-sds-header-xl font-semibold pt-4">
            {modalData.title}
          </p>

          <button onClick={closeDownloadModal} type="button">
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
    </DownloadModalContext.Provider>
  )
}
