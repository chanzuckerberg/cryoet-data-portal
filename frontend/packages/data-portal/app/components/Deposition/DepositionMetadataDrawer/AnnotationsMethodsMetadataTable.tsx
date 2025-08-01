import { CollapsibleDescription } from 'app/components/common/CollapsibleDescription/CollapsibleDescription'
import { MethodLinkList } from 'app/components/Deposition/MethodLinks/MethodLinkList'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodTableList } from './MethodTableList'

export function AnnotationsMethodsMetadataTable() {
  const { t } = useI18n()
  const { annotationMethods } = useDepositionById()

  return (
    <MethodTableList
      accordionId="annotation-methods-table"
      data={annotationMethods}
      header="annotationMethods"
      getTableData={(data) =>
        getTableData(
          {
            label: t('annotations'),
            values: [data.count],
          },
          {
            label: t('methodType'),
            values: [data.methodType ?? ''],
          },
          {
            label: t('methodDetails'),
            values: [data.annotationMethod],
            renderValue: (value: string) => (
              <CollapsibleDescription text={value} />
            ),
          },
          {
            label: t('methodLinks'),
            values: [],
            renderValues: () => (
              <MethodLinkList
                annotationMethod={data.annotationMethod}
                methodLinks={data.methodLinks}
                simple
              />
            ),
          },
        )
      }
    />
  )
}
