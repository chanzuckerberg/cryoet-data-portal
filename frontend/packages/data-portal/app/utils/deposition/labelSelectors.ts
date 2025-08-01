import { match } from 'ts-pattern'

import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'
import type { I18nKeys } from 'app/types/i18n'

export interface LabelSelectorOptions {
  isExpandDepositions: boolean
  type: DataContentsType | null
  groupBy: GroupByOption
}

/**
 * Gets the appropriate count label based on current view mode
 * @param options - Label selection options
 * @returns i18n key for the count label
 */
export function getCountLabelI18nKey({
  isExpandDepositions,
  type,
  groupBy,
}: LabelSelectorOptions): I18nKeys {
  return match({ isExpandDepositions, type, groupBy })
    .with(
      {
        isExpandDepositions: true,
        groupBy: GroupByOption.DepositedLocation,
      },
      () => 'datasets' as const,
    )
    .with(
      { isExpandDepositions: true, groupBy: GroupByOption.Organism },
      () => 'organisms' as const,
    )
    .with(
      { isExpandDepositions: true, type: DataContentsType.Annotations },
      () => 'annotations' as const,
    )
    .with(
      { isExpandDepositions: true, type: DataContentsType.Tomograms },
      () => 'tomograms' as const,
    )
    .otherwise(() => 'datasets' as const)
}
