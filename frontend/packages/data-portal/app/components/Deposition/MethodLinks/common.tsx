import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { SourceCodeIcon, WeightsIcon } from 'app/components/icons'
import { methodTypes } from 'app/constants/methodTypes'
import { I18nKeys } from 'app/types/i18n'

import {
  MethodDataType,
  MethodLinkDataType,
  MethodLinkType,
  methodLinkTypes,
} from './type'

export interface MethodLink {
  i18nLabel: I18nKeys
  url: string
  icon: ReactNode
  title?: string
}

const methodTypeToI18nKey: { [key in MethodLinkType]: I18nKeys } = {
  source_code: 'sourceCode',
  model_weights: 'modelWeights',
  website: 'website',
  documentation: 'documentation',
  other: 'other',
} as const

export const iconMap: { [key in MethodLinkType]: ReactNode } = {
  source_code: (
    <SourceCodeIcon className="w-sds-icon-s h-sds-icon-s inline-block" />
  ),
  model_weights: (
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

function methodLinkFromVariant({
  link_type: variant,
  link: url,
  custom_name: title,
}: MethodLinkDataType): MethodLink {
  return {
    i18nLabel: methodTypeToI18nKey[variant],
    url,
    title,
    icon: iconMap[variant],
  }
}

export function generateMethodLinks(links: MethodLinkDataType[]): MethodLink[] {
  return links
    .sort(
      (a, b) =>
        methodLinkTypes.indexOf(a.link_type) -
        methodLinkTypes.indexOf(b.link_type),
    )
    .map((props) => methodLinkFromVariant(props))
}

export type CombinedMethodDataType = {
  annotationsCount: number
  methodData: MethodDataType
}

export function combineSameMethodData(
  data: MethodDataType[],
): CombinedMethodDataType[] {
  data.sort(
    (a, b) =>
      methodTypes.indexOf(a.method_type) - methodTypes.indexOf(b.method_type),
  )

  return data.reduce((all: CombinedMethodDataType[], curr: MethodDataType) => {
    const last = all[all.length - 1]
    if (
      last &&
      last.methodData.method_type === curr.method_type &&
      last.methodData.annotation_method === curr.annotation_method
    ) {
      const lastMethodLinks = last.methodData.method_links ?? []

      curr.method_links
        ?.filter((link) => !lastMethodLinks.includes(link))
        .map((link) => lastMethodLinks.push(link))

      last.annotationsCount += 1
    } else {
      all.push({ annotationsCount: 1, methodData: curr })
    }

    return all
  }, [] as CombinedMethodDataType[])
}
