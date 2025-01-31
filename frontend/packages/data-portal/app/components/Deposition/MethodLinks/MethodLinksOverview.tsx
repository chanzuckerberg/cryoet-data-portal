import { Icon } from '@czi-sds/components'

import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { CollapsibleList } from 'app/components/CollapsibleList'
import { I18n } from 'app/components/I18n'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { Tooltip } from 'app/components/Tooltip'
import {
  getMethodTypeLabelI18nKey,
  getMethodTypeTooltipI18nKey,
} from 'app/constants/methodTypes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'

import { MethodLink } from './MethodLink'

export function MethodLinksOverview() {
  const { t } = useI18n()

  const { annotationMethods } = useDepositionById()

  const separator = <div className="h-[1px] bg-sds-color-primitive-gray-300" />

  return (
    <div>
      <PageHeaderSubtitle className="mb-sds-m">
        {t('annotationMethodsSummary')}
      </PageHeaderSubtitle>
      <div className="p-sds-l flex flex-col gap-sds-l bg-sds-color-primitive-gray-100  rounded-sds-m">
        {annotationMethods.map(
          ({ annotationMethod, methodType, methodLinks }, i) => (
            <>
              <div className="grid grid-cols-[1fr_2fr] gap-x-sds-xl gap-y-sds-xs">
                <h3 className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase">
                  {t('methodType')}
                </h3>
                <div className="flex flex-row gap-sds-xxs text-sds-body-xxs leading-sds-body-xxs col-start-1">
                  {t(
                    getMethodTypeLabelI18nKey(
                      methodType ?? Annotation_Method_Type_Enum.Automated,
                    ),
                  )}
                  <Tooltip
                    // FIXME: make arrow centred on icon
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
                      sdsType="static"
                      className="!text-sds-color-primitive-gray-500"
                    />
                  </Tooltip>
                </div>
                <h3 className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase col-start-2 row-start-1">
                  {t('methodLinks')}
                </h3>
                <CollapsibleList
                  entries={links?.map((link) => ({
                    key: `${link.url}_${link.i18nLabel}_${link.title}`,
                    entry: (
                      <MethodLink
                        {...link}
                        className="text-sds-body-xxs leading-sds-body-xxs"
                        linkProps={{
                          className: 'text-sds-color-primitive-gray-600',
                          variant: 'dashed-underlined',
                        }}
                      />
                    ),
                  }))}
                  collapseAfter={1}
                />
              </div>
              {i < deposition.annotation_methods.length - 1 && separator}
            </>
          ),
        )}
      </div>
    </div>
  )
}
