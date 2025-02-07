import { useLocation } from '@remix-run/react'
import { match, P } from 'ts-pattern'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'
import { DownloadConfig } from 'app/types/download'

import { SelectSaveDestination } from './SelectSaveDestination'

const AWS_S3_BASE_COMMAND = 'aws s3 --no-sign-request'

export function getAwsCommand({
  s3Path,
  s3Command,
  isAllAnnotations = false,
}: {
  s3Path: string | undefined
  s3Command: 'cp' | 'sync'
  isAllAnnotations?: boolean
}): string {
  const originPath = s3Path?.replace(/\/$/, '')
  const destinationPath = originPath?.split('/').pop()

  if (isAllAnnotations) {
    const basePathMatch = s3Path?.match(/^(s3:\/\/[^/]+\/.*?\/Reconstructions)/)
    const basePath = basePathMatch ? basePathMatch[1] : ''

    return `${AWS_S3_BASE_COMMAND} ${s3Command} ${basePath}/ Annotations --exclude "*" --include "*/Annotations/*"`
  }

  return `${AWS_S3_BASE_COMMAND} ${s3Command} ${originPath} ${destinationPath}`
}

export function AWSDownloadTab() {
  const { t } = useI18n()
  const { s3Path } = useDownloadModalContext()
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()
  const location = useLocation()
  const { downloadConfig, fileFormat } = useDownloadModalQueryParamState()

  const s3Command = match({
    pathname: location.pathname,
    downloadConfig,
    fileFormat,
  })
    .with(
      { pathname: P.string.includes('/datasets') },
      { downloadConfig: DownloadConfig.AllAnnotations },
      { fileFormat: 'zarr' },
      () => 'sync' as const,
    )
    .otherwise(() => 'cp' as const)

  const isAllAnnotations = downloadConfig === DownloadConfig.AllAnnotations
  const awsCommand = getAwsCommand({ s3Path, s3Command, isAllAnnotations })

  return (
    <div className="pt-sds-xl">
      <SelectSaveDestination />

      <CopyBox
        content={awsCommand}
        title={`2. ${t('copyAndRunAwsCliCommand')}`}
        titleClassName="text-sds-header-s leading-sds-header-s font-semibold mt-sds-l"
        onCopy={() => logPlausibleCopyEvent('aws-s3-command', awsCommand)}
      />
      <div className="mt-sds-xxs">
        <I18n i18nKey="youMustHaveCliInstalled" />
      </div>
    </div>
  )
}
