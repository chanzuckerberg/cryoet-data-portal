import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { I18n } from 'app/components/I18n'
import { TableCell } from 'app/components/Table'
import {
  getMethodTypeLabelI18nKey,
  getMethodTypeTooltipI18nKey,
} from 'app/constants/methodTypes'
import { useI18n } from 'app/hooks/useI18n'
import { DASHED_BORDERED_CLASSES } from 'app/utils/classNames'
import { cnsNoMerge } from 'app/utils/cns'

const ROOT_CLASS_NAME = cnsNoMerge(
  'text-sds-header-s-600-wide leading-sds-header-s',
  DASHED_BORDERED_CLASSES,
)

export function MethodTypeCell({
  methodType,
  onClick,
}: {
  methodType: Annotation_Method_Type_Enum
  onClick?: () => void
}) {
  const { t } = useI18n()

  return (
    <TableCell
      tooltip={<I18n i18nKey={getMethodTypeTooltipI18nKey(methodType)} />}
      tooltipProps={{ placement: 'top' }}
      width={{ width: 160 }}
    >
      {onClick ? (
        <button className={ROOT_CLASS_NAME} onClick={onClick} type="button">
          {t(getMethodTypeLabelI18nKey(methodType))}
        </button>
      ) : (
        <span className={ROOT_CLASS_NAME}>
          {t(getMethodTypeLabelI18nKey(methodType))}
        </span>
      )}
    </TableCell>
  )
}
