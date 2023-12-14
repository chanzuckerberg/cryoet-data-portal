import { match, P } from 'ts-pattern'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadConfig } from 'app/types/download'

import { SelectSaveDestination } from './SelectSaveDestination'

export function AWSDownloadTab() {
  const { t } = useI18n()
  const { downloadConfig } = useDownloadModalQueryParamState()
  const { s3DatasetPrefix, s3TomogramPrefix, s3TomogramVoxelPrefix, type } =
    useDownloadModalContext()

  const s3AnnotationsPrefix = s3TomogramVoxelPrefix
    ? `${s3TomogramVoxelPrefix}Annotations`
    : undefined

  const s3Path = match([type, downloadConfig])
    .with(['dataset', P._], () => s3DatasetPrefix)
    .with(['runs', DownloadConfig.AllAnnotations], () => s3AnnotationsPrefix)
    .otherwise(() => s3TomogramPrefix)

  const destinationPath = s3Path?.replace(/\/$/, '').split('/').pop()
  const awsCommand = `aws s3 --no-sign-request sync ${s3Path} ${destinationPath}`

  return (
    <div className="py-sds-xl">
      <SelectSaveDestination />

      <CopyBox
        content={awsCommand}
        title={`2. ${t('copyAndRunAwsS3Command')}`}
        titleClassName="text-sds-header-s leading-sds-header-s font-semibold mt-sds-l"
      />
      <div className="mt-sds-xxs">
        <I18n i18nKey="youMustHaveCliInstalled" />
      </div>
    </div>
  )
}
