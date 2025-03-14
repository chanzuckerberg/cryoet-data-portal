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

import { generateMethodLinkProps } from './common'
import { MethodLink } from './MethodLink'

export function MethodLinksOverview() {
  const { t } = useI18n()
  const { annotationMethods } = useDepositionById()

  const separator = (
    <div className="h-[1px] bg-light-sds-color-primitive-gray-300" />
  )

  return (
    <div>
      <PageHeaderSubtitle className="mb-sds-m">
        {t('annotationMethodsSummary')}
      </PageHeaderSubtitle>
      <div className="p-sds-l flex flex-col gap-sds-l bg-light-sds-color-primitive-gray-100  rounded-sds-m">
        {annotationMethods.map(
          ({ annotationMethod, methodType, methodLinks }, i) => (
            <>
              <div className="grid grid-cols-[1fr_2fr] gap-x-sds-xl gap-y-sds-xs">
                <h3 className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs font-semibold uppercase">
                  {t('methodType')}
                </h3>
                <div className="flex flex-row gap-sds-xxs text-sds-body-xxs-400-wide leading-sds-body-xxs col-start-1">
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
                      className="!text-light-sds-color-primitive-gray-500"
                    />
                  </Tooltip>
                </div>
                <h3 className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs font-semibold uppercase col-start-2 row-start-1">
                  {t('methodLinks')}
                </h3>
                <CollapsibleList
                  entries={generateMethodLinkProps(methodLinks).map(
                    (methodLinkProps) => ({
                      key: `${annotationMethod}_${methodLinkProps.title}_${methodLinkProps.url}`,
                      entry: (
                        <MethodLink
                          {...methodLinkProps}
                          className="text-sds-body-xxs-400-wide leading-sds-body-xxs"
                          linkProps={{
                            className:
                              'text-light-sds-color-primitive-gray-600',
                            variant: 'dashed-underlined',
                          }}
                        />
                      ),
                    }),
                  )}
                  collapseAfter={1}
                />
              </div>
              {i < annotationMethods.length - 1 && separator}
            </>
          ),
        )}
      </div>
    </div>
  )
}
