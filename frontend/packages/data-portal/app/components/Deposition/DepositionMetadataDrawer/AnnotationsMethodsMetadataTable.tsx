import {
  Annotation_Method_Link_Type_Enum,
  Annotation_Method_Type_Enum,
} from 'app/__generated_v2__/graphql'
import type { AnnotationMethodMetadata } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodLinkList } from '../MethodLinks/MethodLinkList'
import { MethodTableList } from './MethodTableList'

const MOCK_DATA: AnnotationMethodMetadata[] = Array(2)
  .fill(null)
  .map(() => ({
    annotationMethod: 'Lorem ipsum dolor sit amet',
    count: 30,
    annotationSoftware: '',
    methodType: Annotation_Method_Type_Enum.Hybrid,
    methodLinks: [
      {
        name: 'Link 1',
        linkType: Annotation_Method_Link_Type_Enum.Website,
        link: 'https://example.com',
      },
      {
        name: 'Link 2',
        linkType: Annotation_Method_Link_Type_Enum.ModelsWeights,
        link: 'https://example.com',
      },
      {
        name: 'Link 3',
        linkType: Annotation_Method_Link_Type_Enum.Documentation,
        link: 'https://example.com',
      },
    ],
  }))

export function AnnotationsMethodsMetadataTable() {
  const { t } = useI18n()

  return (
    <MethodTableList
      accordionId="annotation-methods-table"
      data={MOCK_DATA}
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
          },
          {
            label: t('methodLinks'),
            values: [],
            renderValues: () => (
              <MethodLinkList
                annotationMethod={data.annotationMethod}
                methodLinks={data.methodLinks}
              />
            ),
          },
        )
      }
    />
  )
}
