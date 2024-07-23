import { QueryParams } from 'app/constants/query'

import { E2E_CONFIG, SINGLE_RUN_URL, translations } from './constants'
import { testMultiInputFilter, testSingleSelectFilter } from './filters'
import { validateAnnotationsTable } from './filters/utils'

testMultiInputFilter({
  label: translations.annotationAuthor,
  filters: [
    {
      queryParam: QueryParams.AuthorName,
      label: translations.authorName,
      valueKey: 'authorName',
    },
    {
      queryParam: QueryParams.AuthorOrcid,
      label: translations.authorOrcid,
      valueKey: 'authorOrcId',
    },
  ],
  url: 'http://google.com',
  validateTable: validateAnnotationsTable,
})

testSingleSelectFilter({
  label: translations.objectName,
  queryParam: QueryParams.ObjectName,
  values: [E2E_CONFIG.objectName],
  url: SINGLE_RUN_URL,
  validateTable: validateAnnotationsTable,
})

testMultiInputFilter({
  label: translations.goId,
  filters: [
    {
      queryParam: QueryParams.GoId,
      label: translations.filterByGeneOntologyId,
      valueKey: 'goId',
    },
  ],
  url: SINGLE_RUN_URL,
  validateTable: validateAnnotationsTable,
})

testSingleSelectFilter({
  label: translations.objectShapeType,
  queryParam: QueryParams.ObjectShapeType,
  values: [E2E_CONFIG.objectShapeType],
  url: SINGLE_RUN_URL,
  validateTable: validateAnnotationsTable,
})

testSingleSelectFilter({
  label: translations.annotationSoftware,
  queryParam: QueryParams.AnnotationSoftware,
  values: [E2E_CONFIG.annotationSoftware],
  url: SINGLE_RUN_URL,
  validateTable: validateAnnotationsTable,
})
