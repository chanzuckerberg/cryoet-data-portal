import { QueryParams } from 'app/constants/query'
import { GroupByOption } from 'app/types/depositionTypes'

import { useQueryParam } from './useQueryParam'

interface UseGroupByOptions {
  preventScrollReset?: boolean
}

export function useGroupBy(
  options: UseGroupByOptions = {},
): [GroupByOption, (value: GroupByOption | null) => void] {
  const { preventScrollReset } = options

  const [groupBy, setGroupBy] = useQueryParam<GroupByOption, GroupByOption>(
    QueryParams.GroupBy,
    {
      defaultValue: GroupByOption.None,
      serialize: (value) => String(value),
      deserialize: (value) => (value as GroupByOption) || GroupByOption.None,
      preventScrollReset,
    },
  )

  return [groupBy, setGroupBy]
}
