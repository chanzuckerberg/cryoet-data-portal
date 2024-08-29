import { MethodType } from 'app/constants/methodTypes'

// note: below is also used for ordering in lists
export const methodLinkTypes = [
  'source_code',
  'model_weights',
  'website',
  'documentation',
  'other',
] as const

export type MethodLinkType = (typeof methodLinkTypes)[number]

export type MethodLinkDataType = {
  link: string
  link_type: (typeof methodLinkTypes)[number]
  custom_name?: string
}

export type MethodDataType = {
  method_type: MethodType
  annotation_method: string
  method_links?: MethodLinkDataType[]
  annotation_software: string
}
