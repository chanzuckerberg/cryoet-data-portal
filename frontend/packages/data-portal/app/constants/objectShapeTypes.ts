import { I18nKeys } from 'app/types/i18n'
import { ObjectShapeType } from 'app/types/shapeTypes'

type ShapeTypeToI18nKeyMap = { [key in ObjectShapeType]: I18nKeys }

export const shapeTypeToI18nKey: ShapeTypeToI18nKeyMap = {
  InstanceSegmentation: 'instanceSegmentation',
  OrientedPoint: 'orientedPoint',
  Point: 'point',
  SegmentationMask: 'segmentationMask',
}

export const shapeTypeToI18nKeyPlural: ShapeTypeToI18nKeyMap = {
  InstanceSegmentation: 'instanceSegmentations',
  OrientedPoint: 'orientedPoints',
  Point: 'points',
  SegmentationMask: 'segmentationMasks',
}
