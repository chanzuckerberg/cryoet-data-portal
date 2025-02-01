import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { Annotation_Method_Link_Type_Enum } from 'app/__generated_v2__/graphql'
import { SourceCodeIcon, WeightsIcon } from 'app/components/icons'
import { AnnotationMethodLink } from 'app/types/gql/genericTypes'
import { I18nKeys } from 'app/types/i18n'

import { MethodLinkProps } from './MethodLink'

export const METHOD_LINK_TYPE_ORDER: Annotation_Method_Link_Type_Enum[] = [
  Annotation_Method_Link_Type_Enum.SourceCode,
  Annotation_Method_Link_Type_Enum.ModelsWeights,
  Annotation_Method_Link_Type_Enum.Website,
  Annotation_Method_Link_Type_Enum.Documentation,
  Annotation_Method_Link_Type_Enum.Other,
]

const METHOD_TYPE_TO_I18N_KEY: Record<
  Annotation_Method_Link_Type_Enum,
  I18nKeys
> = {
  source_code: 'sourceCode',
  models_weights: 'modelWeights',
  website: 'website',
  documentation: 'documentation',
  other: 'other',
}

export const ICON_MAP: Record<Annotation_Method_Link_Type_Enum, ReactNode> = {
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
}

export function generateMethodLinkProps(
  links: Array<Pick<AnnotationMethodLink, 'name' | 'linkType' | 'link'>>,
): MethodLinkProps[] {
  return links
    .sort(
      (a, b) =>
        METHOD_LINK_TYPE_ORDER.indexOf(getLinkType(a)) -
        METHOD_LINK_TYPE_ORDER.indexOf(getLinkType(b)),
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
