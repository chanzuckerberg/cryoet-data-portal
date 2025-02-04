import { startCase } from 'lodash-es'
import converter from 'number-to-words'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'
import { getMethodTypeLabelI18nKey } from 'app/constants/methodTypes'
import {
  AnnotationMethodMetadata,
  useDepositionById,
} from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { generateMethodLinkProps } from './common'
import { MethodLink } from './MethodLink'

const COLUMN_WIDTH = 170

function MethodLinkList({
  methodLinks,
}: {
  methodLinks: AnnotationMethodMetadata['methodLinks']
}) {
  const { t } = useI18n()

  if (methodLinks.length === 0) {
    return (
      <p className="text-sds-body-s leading-sds-body-s text-sds-color-primitive-gray-500">
        {t('notSubmitted')}
      </p>
    )
  }

  return (
    <ul>
      {generateMethodLinkProps(methodLinks).map((methodLinkProps) => (
        <li
          key={`${methodLinkProps.url}_${methodLinkProps.i18nLabel}_${methodLinkProps.title}`}
        >
          <MethodLink
            {...methodLinkProps}
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
      {annotationMethods.map(
        (
          {
            annotationMethod,
            annotationSoftware,
            methodType,
            count,
            methodLinks,
          },
          i,
        ) => (
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
                      methodType !== undefined
                        ? t(getMethodTypeLabelI18nKey(methodType))
                        : '--',
                    ],
                  },
                  {
                    label: t('numberOfAnnotations'),
                    values: [count.toLocaleString()],
                  },
                  {
                    label: t('annotationMethod'),
                    values: [annotationMethod],
                  },
                  {
                    label: t('annotationSoftware'),
                    values: [annotationSoftware ?? '--'],
                  },
                  {
                    label: t('methodLinks'),
                    values: [],
                    renderValue: () => (
                      <MethodLinkList methodLinks={methodLinks ?? []} />
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
        ),
      )}
    </Accordion>
  )
}
