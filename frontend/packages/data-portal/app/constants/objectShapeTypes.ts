import { Annotation_File_Shape_Type_Enum } from 'app/__generated_v2__/graphql'
import { I18nKeys } from 'app/types/i18n'
import { ObjectShapeType } from 'app/types/shapeTypes'

type ShapeTypeToI18nKeyMap = { [key in ObjectShapeType]: I18nKeys }

/** @deprecated */
export const shapeTypeToI18nKey = {
  InstanceSegmentation: 'instanceSegmentation',
  OrientedPoint: 'orientedPoint',
  Point: 'point',
  SegmentationMask: 'segmentationMask',
} as const satisfies ShapeTypeToI18nKeyMap

export const SHAPE_TYPE_TO_I18N_KEY: Record<
  Annotation_File_Shape_Type_Enum,
  I18nKeys
> = {
  InstanceSegmentation: 'instanceSegmentation',
  OrientedPoint: 'orientedPoint',
  Point: 'point',
  SegmentationMask: 'segmentationMask',
  Mesh: 'mesh',
}
