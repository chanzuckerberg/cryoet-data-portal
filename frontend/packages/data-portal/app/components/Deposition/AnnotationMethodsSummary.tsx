import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { CollapsibleList } from 'app/components/CollapsibleList'
import { I18n } from 'app/components/I18n'
import { SourceCodeIcon, WeightsIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { Tooltip } from 'app/components/Tooltip'
import {
  methodLabels,
  methodTooltipLabels,
  MethodType,
} from 'app/constants/methodTypes'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'

interface MethodLink {
  i18nLabel: I18nKeys
  url: string
  icon: ReactNode
  title?: string
}

const iconMap = {
  sourceCode: (
    <SourceCodeIcon className="w-sds-icon-s h-sds-icon-s inline-block" />
  ),
  modelWeights: (
    <WeightsIcon className="w-sds-icon-s h-sds-icon-s inline-block" />
  ),
  website: (
    <Icon
      sdsIcon="globe"
      sdsType="static"
      sdsSize="s"
      className="!text-current"
    />
  ),
  documentation: (
    <Icon
      sdsIcon="document"
      sdsType="static"
      sdsSize="s"
      className="!text-current"
    />
  ),
  other: (
    <Icon
      sdsIcon="link"
      sdsType="static"
      sdsSize="s"
      className="!text-current"
    />
  ),
} as const

interface MethodLinkVariantProps {
  variant: keyof typeof iconMap
  url: string
  title?: string
}

const variantOrder: (keyof typeof iconMap)[] = [
  'sourceCode',
  'modelWeights',
  'website',
  'documentation',
  'other',
]

function methodLinkFromVariant({
  variant,
  url,
  title,
}: MethodLinkVariantProps): MethodLink {
  return {
    i18nLabel: variant,
    url,
    title,
    icon: iconMap[variant],
  }
}

function generateMethodLinks(links: MethodLinkVariantProps[]): MethodLink[] {
  return links
    .toSorted(
      (a, b) =>
        variantOrder.indexOf(a.variant) - variantOrder.indexOf(b.variant),
    )
    .map((props) => methodLinkFromVariant(props))
}

function MethodTypeSection({
  methodType,
  links,
}: {
  methodType: MethodType
  links?: MethodLink[]
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
          entry: (
            <span className="text-sds-body-xxs leading-sds-body-xxs flex flex-row">
              <span className="text-sds-gray-black items-center flex flex-row">
                {link.icon}
                <span className="font-semibold ml-sds-xxs mr-sds-xs">
                  {t(link.i18nLabel)}:
                </span>
              </span>
              <Link
                to={link.url}
                variant="dashed-underlined"
                className="text-sds-gray-600"
              >
                {link.title ?? link.url}
              </Link>
            </span>
          ),
        }))}
        collapseAfter={1}
      />
    </div>
  )
}

export function AnnotationMethodsSummary() {
  const { t } = useI18n()

  const separator = <div className="h-[1px] bg-sds-gray-300" />

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
