import { TableRow } from '@czi-sds/components'

import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { AnnotationNameTableCell } from 'app/components/AnnotationTable/AnnotationNameTableCell'
import { TableCell } from 'app/components/Table'

import { MethodTypeCell } from '../MethodLinks/MethodTypeCell'
import { AnnotationRowData } from './types'

interface RunAnnotationRowProps {
  annotation: AnnotationRowData
  runName: string
}

export function RunAnnotationRow({
  annotation,
  runName,
}: RunAnnotationRowProps) {
  return (
    <TableRow
      key={`${runName}-${annotation.id}`}
      className="border-b border-light-sds-color-semantic-base-divider"
      hover={false}
    >
      <TableCell width={{ width: 350 }}>
        <div className="pl-sds-xl">
          <AnnotationNameTableCell
            annotationId={annotation.id}
            groundTruthStatus={annotation.groundTruthStatus}
            objectName={annotation.objectName}
            s3Path={annotation.s3Path}
          />
        </div>
      </TableCell>
      <TableCell width={{ width: 160 }}>
        <span className="text-sds-body-s-400-wide">{annotation.shapeType}</span>
      </TableCell>
      <MethodTypeCell
        methodType={annotation.methodType as Annotation_Method_Type_Enum}
      />
    </TableRow>
  )
}
