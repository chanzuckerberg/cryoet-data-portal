import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useI18n } from 'app/hooks/useI18n'

import { SelectSaveDestination } from './SelectSaveDestination'

export function CurlDownloadTab() {
  const { t } = useI18n()
  const { httpsPath } = useDownloadModalContext()

  return (
    <div className="pt-sds-xl">
      <SelectSaveDestination />

      <CopyBox
        content={`curl -o local.mrc "${httpsPath}"`}
        title={`2. ${t('copyAndRunCurlCommand')}`}
        titleClassName="text-sds-header-s leading-sds-header-s font-semibold mt-sds-l"
      />
      <div className="mt-sds-xxs">
        <I18n i18nKey="youMustHaveCurlInstalled" />
      </div>
    </div>
  )
}
