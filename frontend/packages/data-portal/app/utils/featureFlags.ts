import { useSearchParams } from '@remix-run/react'

import { useEnvironment } from 'app/context/Environment.context'

export type FeatureFlagEnvironment = typeof process.env.ENV

export type FeatureFlagKey =
  | 'downloadSingleAnnotation'
  | 'methodType'
  | 'mlChallenge'

export const FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagEnvironment[]> = {
  downloadSingleAnnotation: ['local', 'dev', 'staging', 'prod'],
  methodType: ['local', 'dev'],
  mlChallenge: ['local', 'dev'],
}

const ENABLE_FEATURE_PARAM = 'enable-feature'
const DISABLE_FEATURE_PARAM = 'disable-feature'

export function getFeatureFlag({
  env,
  key,
  params = new URLSearchParams(),
}: {
  env: FeatureFlagEnvironment
  key: FeatureFlagKey
  params?: URLSearchParams
}): boolean {
  if (params.getAll(DISABLE_FEATURE_PARAM).includes(key)) {
    return false
  }

  if (params.getAll(ENABLE_FEATURE_PARAM).includes(key)) {
    return true
  }

  return FEATURE_FLAGS[key].includes(env)
}

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const [params] = useSearchParams()
  const { ENV } = useEnvironment()

  return getFeatureFlag({
    key,
    params,
    env: ENV,
  })
}
