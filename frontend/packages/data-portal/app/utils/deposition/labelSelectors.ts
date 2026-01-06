import { match } from 'ts-pattern'

import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'
import type { I18nKeys } from 'app/types/i18n'

export interface LabelSelectorOptions {
  type: DataContentsType | null
  groupBy: GroupByOption
}

/**
 * Gets the appropriate count label based on current view mode
 * @param options - Label selection options
 * @returns i18n key for the count label
 */
export function getCountLabelI18nKey({
  type,
  groupBy,
}: LabelSelectorOptions): I18nKeys {
  return match({ type, groupBy })
    .with(
      { groupBy: GroupByOption.DepositedLocation },
      () => 'datasets' as const,
    )
    .with({ groupBy: GroupByOption.Organism }, () => 'organisms' as const)
    .with({ type: DataContentsType.Annotations }, () => 'annotations' as const)
    .with({ type: DataContentsType.Tomograms }, () => 'tomograms' as const)
    .otherwise(() => 'datasets' as const)
}
