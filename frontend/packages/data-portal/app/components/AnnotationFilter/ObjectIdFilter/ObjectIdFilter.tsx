import { RegexFilter } from 'app/components/Filters'
import { GO, UNIPROTKB } from 'app/constants/annotationObjectIdLinks'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import {
  PrefixValueProvider,
  usePrefixValueContext,
} from './PrefixValueContext'
// const OBJECT_ID_ONTOLOGIES = [
//   {
//     id: 'go',
//     shortLabel: 'goId',
//     longLabel: 'goIdLong',
//     prefix: GO_PREFIX,
//     link: GO,
//   },
//   {
//     id: 'go',
//     shortLabel: 'goId',
//     longLabel: 'goIdLong',
//     prefix: UNIPROTKB_PREFIX,
//     link: UNIPROTKB,
//   },
// ]

const prefixOptions = [
  {
    id: 'go',
    name: 'GO ID',
    details: 'Gene Ontology ID',
    link: GO,
    prefix: 'GO:',
  },
  {
    id: 'uniprotkb',
    name: 'UniProtKB',
    details: 'The UniProt Knowledgebase',
    link: UNIPROTKB,
    prefix: 'UNIPROTKB:',
  },
]

// // const prefix = QueryParamToIdPrefixMap[queryParam]
// // console.log('prefix', prefix)
// const validationRegex = useMemo(
//   () => (prefix ? getEntityIdPrefixRegex(prefix) : ALL_DIGITS_REGEX),
//   [prefix],
// )
const prefixes = prefixOptions.map((opt) =>
  opt.prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
) // escape any special chars
const prefixPattern = prefixes.join('|') // e.g. 'GO:|UNIPROTKB:'
const validationRegex = new RegExp(`^(${prefixPattern})?[A-Z0-9]+$`)

export function ObjectIdFilterContent() {
  const { t } = useI18n()
  const { prefixValue } = usePrefixValueContext()
  return (
    <RegexFilter
      id="object-id-input"
      title={t('filterByObjectId')}
      label={t('objectId')}
      queryParam={QueryParams.ObjectId}
      regex={validationRegex}
      prefixOptions={prefixOptions}
      displayNormalizer={(value) => {
        return value
      }}
      paramNormalizer={(value) => {
        // console.log('paramNormalizer', value, prefixValue)
        if (!prefixValue) {
          return value
        }
        // if the value has a prefix and it is the same as the selected prefix, keep it
        // if the value has no prefix, add the selected prefix
        if (value.startsWith(prefixValue.prefix)) {
          // console.log('value has prefix', value)
          return value
        }
        if (value.match(validationRegex)) {
          // console.log('value has no prefix', value)
          // if the value has no prefix, add the selected prefix
          return `${prefixValue.prefix}${value}`
        }
        // if the value has a prefix and it is different from the selected prefix, change the selected prefix

        // this has to return the value that will go in the url param
        // so right now we check if there are matches and allow apply if so.

        return value
      }}
    />
  )
}

export function ObjectIdFilter() {
  return (
    <PrefixValueProvider initialOptions={prefixOptions}>
      <ObjectIdFilterContent />
    </PrefixValueProvider>
  )
}
