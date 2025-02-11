import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'

import { ErrorBoundary } from '../ErrorBoundary'
import {
  AuthorFilter,
  BooleanFilter,
  FilterPanel,
  FilterSection,
} from '../Filters'

export function DepositionsFilters() {
  const {
    updateValue,
    tags: { competition },
  } = useFilter()
  const filters = [
    {
      logId: 'competition-filter',
      filter: (
        <BooleanFilter
          label="CZII ML Competition 2024"
          onChange={(value) =>
            updateValue(QueryParams.Competition, value ? 'true' : null)
          }
          value={competition}
        />
      ),
    },
    {
      logId: 'author-filter',
      filter: <AuthorFilter label="Deposition Author" />,
    },
  ]

  return (
    <FilterPanel>
      <FilterSection>
        {filters.map(({ filter, logId }) => (
          <ErrorBoundary key={logId} logId={logId}>
            {filter}
          </ErrorBoundary>
        ))}
      </FilterSection>
    </FilterPanel>
  )
}
