import { MethodType } from 'app/constants/methodTypes'

// note: below is also used for ordering in lists
export const METHOD_LINK_TYPES = [
  'source_code',
  'models_weights',
  'website',
  'documentation',
  'other',
] as const

export type MethodLinkType = (typeof METHOD_LINK_TYPES)[number]

export type MethodLinkDataType = {
  link: string
  link_type: MethodLinkType
  custom_name?: string
}

export type MethodDataType = {
  method_type: MethodType
  annotation_method: string
  method_links?: MethodLinkDataType[]
  annotation_software: string
}
