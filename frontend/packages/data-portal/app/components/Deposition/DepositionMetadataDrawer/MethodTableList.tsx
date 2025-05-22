import { Fragment } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'
import { useI18n } from 'app/hooks/useI18n'
import type { I18nKeys } from 'app/types/i18n'
import type { TableData } from 'app/types/table'
import { cns } from 'app/utils/cns'

export function MethodTableList<T>({
  data,
  getTableData,
  accordionId,
  header,
}: {
  accordionId: string
  data: T[]
  header: I18nKeys
  getTableData(data: T): TableData[]
}) {
  const { t } = useI18n()

  return (
    <Accordion header={t(header)} id={accordionId} initialOpen>
      {data.map((d, index) => {
        const tableData = getTableData(d)

        return (
          // safe to use index as key since list never changes
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={`method-table-${index}`}>
            <div className="flex items-center gap-[10px]">
              <p
                className={cns(
                  'uppercase !text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs',
                  'font-semibold text-light-sds-color-primitive-gray-600',
                )}
              >
                {t('methodCount', { value: index + 1 })}
              </p>
              <div className="flex-grow h-[1px] bg-light-sds-color-primitive-gray-300" />
            </div>

            <MetadataTable data={tableData} invertRowColor />
          </Fragment>
        )
      })}
    </Accordion>
  )
}
