import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'

import { MethodLinkList } from './MethodLinkList'
import { MethodTypeLabel } from './MethodTypeLabel'

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

                <MethodTypeLabel
                  className="col-start-1"
                  methodType={methodType}
                />

                <h3 className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs font-semibold uppercase col-start-2 row-start-1">
                  {t('methodLinks')}
                </h3>

                <MethodLinkList
                  annotationMethod={annotationMethod}
                  methodLinks={methodLinks}
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
