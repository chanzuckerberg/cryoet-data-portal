import { useNavigation } from '@remix-run/react'

export function useIsLoading() {
  const navigation = useNavigation()
  return navigation.state === 'loading'
}
