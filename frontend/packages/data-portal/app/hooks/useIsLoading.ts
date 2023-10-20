import { useDebouncedState } from '@react-hookz/web'
import { useNavigation } from '@remix-run/react'
import { useEffect } from 'react'

/**
 * Returns props related to loading state.
 *
 * The `isLoading` prop is useful for
 * when a component needs to know about the immediate loading state.
 *
 * The `isLoadingDebounced` state is good for when a component needs to know
 * about the loading state after a short delay. For example, it is preferred to
 * use the debounced loading state for UI skeleton loaders because it prevents
 * the UI from quickly flashing the loading state when navigation to another
 * page is fast. This is especially noticeable when navigating to a cached route.
 */
export function useIsLoading() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  const [isLoadingDebounced, setIsLoadingDebounced] = useDebouncedState(
    isLoading,
    500,
  )

  useEffect(
    () => setIsLoadingDebounced(isLoading),
    [isLoading, setIsLoadingDebounced],
  )

  return {
    isLoading,
    isLoadingDebounced,
  }
}
