import { test } from '@playwright/test'

import { FeatureFlagKey, getFeatureFlag } from 'app/utils/featureFlags'

export function skipIfFeatureIsDisabled(key: FeatureFlagKey) {
  const isEnabled = getFeatureFlag({
    key,
    env: process.env.ENV,
  })

  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!isEnabled, `Skipping because feature ${key} is disabled`)
}
