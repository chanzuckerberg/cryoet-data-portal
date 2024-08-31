import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { SourceCodeIcon, WeightsIcon } from 'app/components/icons'
import { I18nKeys } from 'app/types/i18n'

export interface MethodLinkProps {
  i18nLabel: I18nKeys
  url: string
  icon: ReactNode
  title?: string
}

export const iconMap = {
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

export interface MethodLinkVariantProps {
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
}: MethodLinkVariantProps): MethodLinkProps {
  return {
    i18nLabel: variant,
    url,
    title,
    icon: iconMap[variant],
  }
}

export function generateMethodLinks(
  links: MethodLinkVariantProps[],
): MethodLinkProps[] {
  return links
    .toSorted(
      (a, b) =>
        variantOrder.indexOf(a.variant) - variantOrder.indexOf(b.variant),
    )
    .map((props) => methodLinkFromVariant(props))
}
