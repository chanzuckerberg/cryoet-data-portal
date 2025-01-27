import { I18nKeys } from 'app/types/i18n'
import { ObjectShapeType } from 'app/types/shapeTypes'

type ShapeTypeToI18nKeyMap = { [key in ObjectShapeType]: I18nKeys }

export const shapeTypeToI18nKey = {
  InstanceSegmentation: 'instanceSegmentation',
  OrientedPoint: 'orientedPoint',
  Point: 'point',
  SegmentationMask: 'segmentationMask',
} as const satisfies ShapeTypeToI18nKeyMap
