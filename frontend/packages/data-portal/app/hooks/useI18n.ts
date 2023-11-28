import { useTranslation, UseTranslationOptions } from 'react-i18next'

/**
 * Wrapper over `useTranslation` hook that uses `translation` namespace by
 * default so that the `t` function is typed with all of the i18n keys.
 */
export function useI18n(options?: UseTranslationOptions<undefined>) {
  return useTranslation('translation', options)
}
