import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { ErrorBoundary } from '../ErrorBoundary'
import {
  AuthorFilter,
  BooleanFilter,
  FilterPanel,
  FilterSection,
} from '../Filters'

export function DepositionsFilters() {
  const showCompetitionFilter = useFeatureFlag('postMlChallenge')
  const {
    updateValue,
    tags: { competition },
  } = useFilter()
  const filters = [
    {
      logId: 'competition-filter',
      filter: (
        <div>
          {showCompetitionFilter && (
            <BooleanFilter
              label="CZII ML Competition 2024"
              onChange={(value) =>
                updateValue(QueryParams.Competition, value ? 'true' : null)
              }
              value={competition}
            />
          )}
        </div>
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
