import { Icon } from '@czi-sds/components'

import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { I18n } from 'app/components/I18n'
import { Tooltip } from 'app/components/Tooltip'
import {
  getMethodTypeLabelI18nKey,
  getMethodTypeTooltipI18nKey,
} from 'app/constants/methodTypes'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function MethodTypeLabel({
  className,
  methodType,
}: {
  className?: string
  methodType?: Annotation_Method_Type_Enum
}) {
  const { t } = useI18n()

  return (
    <div
      className={cns(
        'flex flex-row gap-sds-xxs',
        'text-sds-body-xxs-400-wide leading-sds-body-xxs',
        className,
      )}
    >
      {t(
        getMethodTypeLabelI18nKey(
          methodType ?? Annotation_Method_Type_Enum.Automated,
        ),
      )}

      <Tooltip
        placement="top"
        tooltip={
          <I18n
            i18nKey={getMethodTypeTooltipI18nKey(
              methodType ?? Annotation_Method_Type_Enum.Automated,
            )}
          />
        }
      >
        <Icon
          sdsIcon="InfoCircle"
          sdsSize="xs"
          className="!text-light-sds-color-primitive-gray-500"
        />
      </Tooltip>
    </div>
  )
}
