import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { Annotation_Method_Link_Type_Enum } from 'app/__generated_v2__/graphql'
import { SourceCodeIcon, WeightsIcon } from 'app/components/icons'
import { AnnotationMethodLink } from 'app/types/gql/genericTypes'
import { I18nKeys } from 'app/types/i18n'

import { MethodLinkProps } from './MethodLink'
import { METHOD_LINK_TYPES, MethodLinkDataType, MethodLinkType } from './type'

const METHOD_TYPE_TO_I18N_KEY: { [key in MethodLinkType]: I18nKeys } = {
  source_code: 'sourceCode',
  models_weights: 'modelWeights',
  website: 'website',
  documentation: 'documentation',
  other: 'other',
} as const

export const ICON_MAP: { [key in MethodLinkType]: ReactNode } = {
  source_code: (
    <SourceCodeIcon className="w-sds-icon-s h-sds-icon-s inline-block" />
  ),
  models_weights: (
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

export function generateMethodLinkProps(
  links: AnnotationMethodLink[],
): MethodLinkProps[] {
  return links
    .sort(
      (a, b) =>
        METHOD_LINK_TYPES.indexOf(getLinkType(a)) -
        METHOD_LINK_TYPES.indexOf(getLinkType(b)),
    )
    .map((link) => ({
      title: link.name ?? '',
      url: link.link ?? '',
      icon: ICON_MAP[getLinkType(link)],
      i18nLabel: METHOD_TYPE_TO_I18N_KEY[getLinkType(link)],
    }))
}

function getLinkType(
  link: AnnotationMethodLink,
): Annotation_Method_Link_Type_Enum {
  return link.linkType ?? Annotation_Method_Link_Type_Enum.Other
}
