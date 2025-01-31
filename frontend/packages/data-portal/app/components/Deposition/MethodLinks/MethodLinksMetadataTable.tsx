import { startCase } from 'lodash-es'
import converter from 'number-to-words'
import { useMemo } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { generateMethodLinks } from './common'
import { MethodLink } from './MethodLink'
import { MethodDataType, MethodLinkDataType } from './type'
import { getMethodTypeLabelI18nKey } from 'app/constants/methodTypes'
import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'

const COLUMN_WIDTH = 170

function MethodLinkList({
  links: variantLinks,
}: {
  links: MethodLinkDataType[]
}) {
  const links = useMemo(() => generateMethodLinks(variantLinks), [variantLinks])

  const { t } = useI18n()

  if (links.length === 0) {
    return (
      <p className="text-sds-body-s leading-sds-body-s text-sds-color-primitive-gray-500">
        {t('notSubmitted')}
      </p>
    )
  }

  return (
    <ul>
      {links.map((link) => (
        <li key={`${link.url}_${link.i18nLabel}_${link.title}`}>
          <MethodLink
            {...link}
            className="text-sds-body-s leading-sds-body-s whitespace-nowrap overflow-hidden text-ellipsis"
            linkProps={{
              className:
                'text-sds-color-primitive-blue-400  overflow-hidden text-ellipsis',
            }}
          />
        </li>
      ))}
    </ul>
  )
}

export function MethodLinksMetadataTable({
  initialOpen = true,
}: {
  initialOpen?: boolean
}) {
  const { t } = useI18n()
  const { annotationMethods } = useDepositionById()

  return (
    <Accordion
      id="method-links-summary-table"
      header={t('annotationMethodsSummary')}
      initialOpen={initialOpen}
    >
      {annotationMethods.map((annotationMethod, i) => (
        <div className="flex flex-col gap-sds-xl">
          <div>
            {annotationMethods.length > 1 && (
              <div className="flex flex-row gap-[10px] mt-sds-xs mb-[10px] items-center whitespace-nowrap">
                <p className="uppercase text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold text-sds-color-primitive-gray-600 basis-0 flex-initial">
                  {t('methodCount', {
                    value: startCase(converter.toWords(i + 1)),
                  })}
                </p>
                <div className="flex-grow h-[1px] bg-sds-color-primitive-gray-300" />
              </div>
            )}
            <MetadataTable
              data={getTableData(
                {
                  label: t('methodType'),
                  values: [
                    t(
                      getMethodTypeLabelI18nKey(
                        annotationMethod.methodType ??
                          Annotation_Method_Type_Enum.Automated,
                      ),
                    ),
                  ],
                },
                {
                  label: t('numberOfAnnotations'),
                  values: [annotationsCount.toLocaleString()],
                },
                {
                  label: t('annotationMethod'),
                  values: [data.annotation_method],
                },
                {
                  label: t('annotationSoftware'),
                  values: [data.annotation_software],
                },
                {
                  label: t('methodLinks'),
                  values: [],
                  renderValue: () => (
                    <MethodLinkList links={data.method_links ?? []} />
                  ),
                },
              )}
              tableCellLabelProps={{
                renderLoadingSkeleton: false,
                width: { min: COLUMN_WIDTH, max: COLUMN_WIDTH },
              }}
              tableCellValueProps={{
                renderLoadingSkeleton: false,
                width: { min: COLUMN_WIDTH },
              }}
            />
          </div>
        </div>
      ))}
    </Accordion>
  )
}
