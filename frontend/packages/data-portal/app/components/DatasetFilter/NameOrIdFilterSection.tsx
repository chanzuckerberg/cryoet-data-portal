import {
  FilterSection,
  InputFilterData,
  MultiInputFilter,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { i18n } from 'app/i18n'

const DATASET_ID_FILTERS: InputFilterData[] = [
  {
    id: 'portal-id-input',
    label: `${i18n.portalIdBlank}:`,
    queryParam: QueryParams.PortalId,
  },
  {
    id: 'empiar-id-input',
    label: `${i18n.empiarID}:`,
    queryParam: QueryParams.EmpiarId,
  },
  {
    id: 'emdb-id-input',
    label: `${i18n.emdb}:`,
    queryParam: QueryParams.EmdbId,
  },
]

const AUTHOR_FILTERS: InputFilterData[] = [
  {
    id: 'author-name-input',
    label: `${i18n.authorName}:`,
    queryParam: QueryParams.AuthorName,
  },
  {
    id: 'author-orcid-input',
    label: `${i18n.authorOrcid}:`,
    queryParam: QueryParams.AuthorOrcid,
  },
]

export function NameOrIdFilterSection() {
  return (
    <FilterSection title={i18n.nameOrId}>
      <MultiInputFilter label={i18n.datasetIds} filters={DATASET_ID_FILTERS} />
      <MultiInputFilter label={i18n.author} filters={AUTHOR_FILTERS} />
    </FilterSection>
  )
}
