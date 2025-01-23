import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { SourceCodeIcon, WeightsIcon } from 'app/components/icons'
import { VariantLinkProps } from 'app/components/Link'
import { I18nKeys } from 'app/types/i18n'

import { METHOD_LINK_TYPES, MethodLinkDataType, MethodLinkType } from './type'

export interface MethodLinkProps {
  i18nLabel: I18nKeys
  url: string
  icon: ReactNode
  title?: string
  className?: string
  linkProps?: Partial<VariantLinkProps>
}

const METHOD_TYPE_TO_I18N_KEY: { [key in MethodLinkType]: I18nKeys } = {
  source_code: 'sourceCode',
  model_weights: 'modelWeights',
  website: 'website',
  documentation: 'documentation',
  other: 'other',
} as const

export const ICON_MAP: { [key in MethodLinkType]: ReactNode } = {
  source_code: (
    <SourceCodeIcon className="w-sds-icon-s h-sds-icon-s inline-block" />
  ),
  model_weights: (
    <WeightsIcon className="w-sds-icon-s h-sds-icon-s inline-block" />
  ),
  website: (
    <Icon
      sdsIcon="Globe"
      sdsType="static"
      sdsSize="s"
      className="!text-current"
    />
  ),
  documentation: (
    <Icon
      sdsIcon="Document"
      sdsType="static"
      sdsSize="s"
      className="!text-current"
    />
  ),
  other: (
    <Icon
      sdsIcon="Link"
      sdsType="static"
      sdsSize="s"
      className="!text-current"
    />
  ),
} as const

function methodLinkFromVariant({
  link_type: variant,
  link: url,
  custom_name: title,
}: MethodLinkDataType): MethodLinkProps {
  return {
    i18nLabel: METHOD_TYPE_TO_I18N_KEY[variant],
    url,
    title,
    icon: ICON_MAP[variant],
  }
}

export function generateMethodLinks(
  links: MethodLinkDataType[],
): MethodLinkProps[] {
  return links
    .sort(
      (a, b) =>
        METHOD_LINK_TYPES.indexOf(a.link_type) -
        METHOD_LINK_TYPES.indexOf(b.link_type),
    )
    .map((props) => methodLinkFromVariant(props))
}
