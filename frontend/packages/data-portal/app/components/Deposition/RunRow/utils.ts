import { AnnotationRowData } from './types'

// GraphQL types for annotation shapes data
interface AnnotationFile {
  s3Path?: string
}

interface AnnotationFileEdge {
  node?: AnnotationFile
}

interface Annotation {
  id?: number
  objectName?: string
  methodType?: string
  groundTruthStatus?: boolean
}

interface AnnotationShape {
  id: number
  shapeType?: string
  annotation?: Annotation
  annotationFiles?: {
    edges?: AnnotationFileEdge[]
  }
}

interface AnnotationShapesData {
  annotationShapes?: AnnotationShape[]
}

/**
 * Transforms GraphQL annotation shapes data to component format
 * @param data - GraphQL data containing annotationShapes
 * @param runName - The name of the run
 * @returns Array of transformed annotation data
 */
export function transformAnnotationData(
  data: unknown,
  runName: string,
): AnnotationRowData[] {
  // Type guard to check if data has the expected structure
  if (
    !data ||
    typeof data !== 'object' ||
    !('annotationShapes' in data) ||
    !Array.isArray((data as AnnotationShapesData).annotationShapes)
  ) {
    return []
  }

  const shapesData = data as AnnotationShapesData
  const annotationShapes = shapesData.annotationShapes || []

  return annotationShapes.map((shape: AnnotationShape) => ({
    id: shape.annotation?.id ?? shape.id,
    annotationName: shape.annotation?.objectName ?? '--',
    shapeType: shape.shapeType ?? '--',
    methodType: shape.annotation?.methodType ?? '--',
    depositedIn: '--',
    depositedLocation: '--',
    runName,
    objectName: shape.annotation?.objectName,
    groundTruthStatus: shape.annotation?.groundTruthStatus,
    s3Path: shape.annotationFiles?.edges?.[0]?.node?.s3Path,
  }))
}
