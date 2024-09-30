import { I18nKeys } from 'app/types/i18n'
import { ObjectShapeType } from 'app/types/shapeTypes'

type ShapeTypeToI18nKeyMap = Map<ObjectShapeType, I18nKeys>

export const shapeTypeToI18nKey: ShapeTypeToI18nKeyMap = new Map([
  ['InstanceSegmentation', 'instanceSegmentation'],
  ['OrientedPoint', 'orientedPoint'],
  ['Point', 'point'],
  ['SegmentationMask', 'segmentationMask'],
])

export const shapeTypeToI18nKeyPlural: ShapeTypeToI18nKeyMap = new Map([
  ['InstanceSegmentation', 'instanceSegmentations'],
  ['OrientedPoint', 'orientedPoints'],
  ['Point', 'points'],
  ['SegmentationMask', 'segmentationMasks'],
])
