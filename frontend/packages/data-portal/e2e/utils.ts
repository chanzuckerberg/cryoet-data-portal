import { test } from '@playwright/test'

import { shapeTypeToI18nKey } from 'app/constants/objectShapeTypes'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { FeatureFlagKey, getFeatureFlag } from 'app/utils/featureFlags'

import { translations } from './constants'

export function onlyRunIfEnabled(key: FeatureFlagKey) {
  const isEnabled = getFeatureFlag({
    key,
    env: process.env.ENV,
  })

  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!isEnabled, `Skipping because feature ${key} is disabled`)
}

type ObjectShapeTranslationType = Pick<
  typeof translations,
  'instanceSegmentation' | 'orientedPoint' | 'point' | 'segmentationMask'
>

export function getObjectShapeTypeLabel(shapeType: ObjectShapeType): string {
  const key = shapeTypeToI18nKey.get(shapeType)
  return key ? translations[key as keyof ObjectShapeTranslationType] : ''
}
