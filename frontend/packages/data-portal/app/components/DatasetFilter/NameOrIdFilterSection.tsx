import {
  FilterSection,
  InputFilterData,
  MultiInputFilter,
} from 'app/components/Filters'
import { DatasetFilterQueryParams } from 'app/constants/query'
import { i18n } from 'app/i18n'

const DATASET_ID_FILTERS: InputFilterData[] = [
  {
    id: 'portal-id-input',
    label: `${i18n.portalIdBlank}:`,
    queryParam: DatasetFilterQueryParams.PortalId,
  },
  {
    id: 'empiar-id-input',
    label: `${i18n.empiarID}:`,
    queryParam: DatasetFilterQueryParams.EmpiarId,
  },
  {
    id: 'emdb-id-input',
    label: `${i18n.emdb}:`,
    queryParam: DatasetFilterQueryParams.EmdbId,
  },
]

const AUTHOR_FILTERS: InputFilterData[] = [
  {
    id: 'author-name-input',
    label: `${i18n.authorName}:`,
    queryParam: DatasetFilterQueryParams.AuthorName,
  },
  {
    id: 'author-orcid-input',
    label: `${i18n.authorOrcid}:`,
    queryParam: DatasetFilterQueryParams.AuthorOrcid,
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
