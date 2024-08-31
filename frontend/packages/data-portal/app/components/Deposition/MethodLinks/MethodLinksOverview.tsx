import { Icon } from '@czi-sds/components'

import { CollapsibleList } from 'app/components/CollapsibleList'
import { I18n } from 'app/components/I18n'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { Tooltip } from 'app/components/Tooltip'
import {
  methodLabels,
  methodTooltipLabels,
  MethodType,
} from 'app/constants/methodTypes'
import { useI18n } from 'app/hooks/useI18n'

import {
  generateMethodLinks,
  MethodLinkProps,
  MethodLinkVariantProps,
} from './common'
import { MethodLink } from './MethodLink'

function MethodTypeSection({
  methodType,
  links,
}: {
  methodType: MethodType
  links?: MethodLinkProps[]
}) {
  const { t } = useI18n()

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-x-sds-xl gap-y-sds-xs">
      <h3 className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase">
        {t('methodType')}
      </h3>
      <p className="flex flex-row gap-sds-xxs text-sds-body-xxs leading-sds-body-xxs col-start-1">
        {t(methodLabels[methodType])}
        <Tooltip
          // FIXME: make arrow centred on icon
          placement="top"
          tooltip={<I18n i18nKey={methodTooltipLabels[methodType]} />}
        >
          <Icon
            sdsIcon="infoCircle"
            sdsSize="xs"
            sdsType="static"
            className="!text-sds-gray-500"
          />
        </Tooltip>
      </p>
      <h3 className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase col-start-2 row-start-1">
        {t('methodLinks')}
      </h3>
      <CollapsibleList
        entries={links?.map((link) => ({
          key: `${link.url}_${link.i18nLabel}_${link.title}`,
          entry: <MethodLink {...link} />,
        }))}
        collapseAfter={1}
      />
    </div>
  )
}

export function MethodLinksOverview() {
  const { t } = useI18n()

  const separator = <div className="h-[1px] bg-sds-gray-300" />

  // TODO: populate this with backend data when available
  const hybridMethodLinks: MethodLinkVariantProps[] = [
    {
      variant: 'sourceCode',
      url: 'https://www.example.com',
    },
    {
      variant: 'website',
      url: 'https://www.example.com',
      title: 'Optional Custom Link Name',
    },
  ]

  const automatedMethodLinks: MethodLinkVariantProps[] = [
    {
      variant: 'sourceCode',
      url: 'https://www.example.com',
    },
    {
      variant: 'website',
      url: 'https://www.example.com',
      title: 'Optional Custom Link Name',
    },
    {
      variant: 'website',
      url: 'https://www.example.com',
    },
    {
      variant: 'sourceCode',
      url: 'https://www.example.com',
      title: 'Optional Custom Link Name',
    },
    {
      variant: 'other',
      url: 'https://www.example.com',
    },
    {
      variant: 'documentation',
      url: 'https://www.example.com',
      title: 'Optional Custom Link Name',
    },
    {
      variant: 'modelWeights',
      url: 'https://www.example.com',
    },
    {
      variant: 'other',
      url: 'https://www.example.com',
      title: 'Optional Custom Link Name',
    },
    {
      variant: 'documentation',
      url: 'https://www.example.com',
    },
    {
      variant: 'modelWeights',
      url: 'https://www.example.com',
      title: 'Optional Custom Link Name',
    },
  ]

  return (
    <div>
      <PageHeaderSubtitle className="mb-sds-m">
        {t('annotationMethodsSummary')}
      </PageHeaderSubtitle>
      <div className="p-sds-l flex flex-col gap-sds-l bg-sds-gray-100 rounded-sds-m">
        <MethodTypeSection
          methodType="hybrid"
          links={generateMethodLinks(hybridMethodLinks)}
        />
        {separator}
        <MethodTypeSection
          methodType="automated"
          links={generateMethodLinks(automatedMethodLinks)}
        />
        {separator}
        <MethodTypeSection methodType="manual" />
      </div>
    </div>
  )
}
