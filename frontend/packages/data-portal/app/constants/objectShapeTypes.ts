import { Annotation_File_Shape_Type_Enum } from 'app/__generated_v2__/graphql'
import { I18nKeys } from 'app/types/i18n'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { checkExhaustive } from 'app/types/utils'

type ShapeTypeToI18nKeyMap = { [key in ObjectShapeType]: I18nKeys }

/** @deprecated */
export const shapeTypeToI18nKey = {
  InstanceSegmentation: 'instanceSegmentation',
  OrientedPoint: 'orientedPoint',
  Point: 'point',
  SegmentationMask: 'segmentationMask',
} as const satisfies ShapeTypeToI18nKeyMap

export function getShapeTypeI18nKey(
  shapeType: Annotation_File_Shape_Type_Enum,
): I18nKeys {
  switch (shapeType) {
    case Annotation_File_Shape_Type_Enum.InstanceSegmentation:
      return 'instanceSegmentation'
    case Annotation_File_Shape_Type_Enum.OrientedPoint:
      return 'orientedPoint'
    case Annotation_File_Shape_Type_Enum.Point:
      return 'point'
    case Annotation_File_Shape_Type_Enum.SegmentationMask:
      return 'segmentationMask'
    case Annotation_File_Shape_Type_Enum.Mesh:
      return 'mesh'
    case Annotation_File_Shape_Type_Enum.InstanceSegmentationMask:
      return 'instanceSegmentationMask'
    default:
      return checkExhaustive(shapeType)
  }
}
