import { startCase } from 'lodash-es'
import converter from 'number-to-words'
import { useMemo } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'
import {
  methodLabels,
  MethodType,
  methodTypes,
} from 'app/constants/methodTypes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { generateMethodLinks } from './common'
import { MethodLink } from './MethodLink'
import { MethodDataType, MethodLinkDataType } from './type'

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

function MethodSummarySection({
  label,
  data,
  annotationsCount,
}: {
  label?: string
  data: MethodDataType
  annotationsCount: number
}) {
  const { t } = useI18n()

  const tableData = getTableData(
    {
      label: t('methodType'),
      values: [t(methodLabels[data.method_type])],
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
      renderValue: () => <MethodLinkList links={data.method_links ?? []} />,
    },
  )

  return (
    <div>
      {label && (
        <div className="flex flex-row gap-[10px] mt-sds-xs mb-[10px] items-center whitespace-nowrap">
          <p className="uppercase text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold text-sds-color-primitive-gray-600 basis-0 flex-initial">
            {label}
          </p>
          <div className="flex-grow h-[1px] bg-sds-color-primitive-gray-300" />
        </div>
      )}
      <MetadataTable
        data={tableData}
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
  )
}

export function MethodLinksMetadataTable({
  initialOpen = true,
}: {
  initialOpen?: boolean
}) {
  const { t } = useI18n()
  const { deposition, annotationMethodCounts } = useDepositionById()

  return (
    <Accordion
      id="method-links-summary-table"
      header={t('annotationMethodsSummary')}
      initialOpen={initialOpen}
    >
      {deposition.annotation_methods
        .sort(
          (a, b) =>
            methodTypes.indexOf((a.method_type ?? 'manual') as MethodType) -
            methodTypes.indexOf((b.method_type ?? 'manual') as MethodType),
        )
        .map((methodData, i) => (
          <div className="flex flex-col gap-sds-xl">
            <MethodSummarySection
              label={
                deposition.annotation_methods.length === 1
                  ? undefined
                  : t('methodCount', {
                      value: startCase(converter.toWords(i + 1)),
                    })
              }
              data={methodData as MethodDataType}
              annotationsCount={
                annotationMethodCounts.get(methodData.annotation_method) ?? 0
              }
            />
          </div>
        ))}
    </Accordion>
  )
}
