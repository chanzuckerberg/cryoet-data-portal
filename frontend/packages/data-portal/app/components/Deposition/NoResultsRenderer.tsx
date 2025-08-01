import { match } from 'ts-pattern'

import { NoFilteredResults } from 'app/components/NoFilteredResults'
import { useFeatureFlag } from 'app/utils/featureFlags'

export interface NoResultsRendererProps {
  isLoading: boolean
}

/**
 * Renders the appropriate no results component based on feature flags and
 * loading state. We return `null` if the `isLoading` state is true because the
 * react-query loading state is separate from the Remix loader data fetcher.
 */
export function NoResultsRenderer({
  isLoading,
}: NoResultsRendererProps): JSX.Element | null {
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  return match({ isExpandDepositions, isLoading })
    .with({ isExpandDepositions: true, isLoading: true }, () => null)
    .otherwise(() => <NoFilteredResults />)
}
