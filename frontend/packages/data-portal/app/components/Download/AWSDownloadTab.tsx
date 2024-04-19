import { useLocation } from '@remix-run/react'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'
import { DownloadConfig } from 'app/types/download'

import { SelectSaveDestination } from './SelectSaveDestination'

export function getAwsCommand({
  s3Path,
  s3Command,
}: {
  s3Path: string | undefined
  s3Command: 'cp' | 'sync'
}): string {
  const destinationPath = s3Path?.replace(/\/$/, '').split('/').pop()
  return `aws s3 --no-sign-request ${s3Command} ${s3Path} ${destinationPath}`
}

export function AWSDownloadTab() {
  const { t } = useI18n()
  const { s3Path } = useDownloadModalContext()
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()
  const location = useLocation()
  const { downloadConfig } = useDownloadModalQueryParamState()

  const s3Command =
    location.pathname.includes('/datasets') ||
    (location.pathname.includes('/runs') &&
      downloadConfig === DownloadConfig.AllAnnotations)
      ? 'sync'
      : 'cp'

  const awsCommand = getAwsCommand({ s3Path, s3Command })

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
