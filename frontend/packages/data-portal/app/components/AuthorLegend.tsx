import { Icon, Tooltip } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { EnvelopeIcon, ORCIDIcon } from 'app/components/icons'

function Legend() {
  return (
    <div className="flex flex-col gap-sds-m min-w-fit">
      <h4 className="text-sds-header-xxs leading-sds-header-xxs font-semibold text-sds-gray-500">
        <I18n i18nKey="authorNameLegend" />
      </h4>
      <div className="grid grid-cols-[max-content_max-content] gap-x-sds-xl gap-y-sds-xxs text-sds-body-xs leading-sds-body-xs text-sds-gray-black">
        <I18n i18nKey="boldedText" />
        <span className="font-semibold">
          <I18n i18nKey="primaryAuthor" />
        </span>
        <span className="text-sds-gray-600">
          <I18n i18nKey="normalText" />
        </span>
        <span className="font-semibold">
          <I18n i18nKey="author" />
        </span>
        <span className="mt-sds-xxxs">
          <EnvelopeIcon className="text-sds-gray-400 align-baseline inline-block h-sds-icon-s w-sds-icon-s" />
        </span>
        <span className="font-semibold">
          <I18n i18nKey="correspondingAuthor" />
        </span>
        <span>
          <ORCIDIcon className="inline-block align-baseline h-sds-icon-s w-sds-icon-s overflow-visible" />
        </span>
        <span className="font-semibold">
          <I18n i18nKey="orcidAvailable" />
        </span>
      </div>
    </div>
  )
}

export function AuthorLegend({ inline = false }: { inline?: boolean }) {
  return (
    <Tooltip
      title={<Legend />}
      classes={{
        tooltip:
          // need to specify background color because it's not visible locally
          '!p-sds-m !min-w-fit border-solid border border-sds-gray-300 !bg-white',
      }}
      placement="top-start"
    >
      <div>
        <Icon
          sdsIcon="infoCircle"
          sdsSize={inline ? 's' : 'xs'}
          sdsType="button"
          className="!text-inherit !inline-block !align-baseline"
        />
      </div>
    </Tooltip>
  )
}
