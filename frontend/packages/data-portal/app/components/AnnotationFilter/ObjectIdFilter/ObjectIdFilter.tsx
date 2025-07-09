import { RegexFilter } from 'app/components/Filters'
import { GO, UNIPROTKB } from 'app/constants/annotationObjectIdLinks'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import {
  PrefixValueProvider,
  usePrefixValueContext,
} from './PrefixValueContext'

const prefixOptions = [
  {
    id: 'go',
    name: 'GO ID',
    details: 'Gene Ontology ID',
    link: GO,
    prefix: 'GO:',
    placeholder: '0016020 or GO:0016020',
  },
  {
    id: 'uniprotkb',
    name: 'UniProtKB',
    details: 'The UniProt Knowledgebase',
    link: UNIPROTKB,
    prefix: 'UniProtKB:',
    placeholder: 'P01267 or UniProtKB:P01267',
  },
]

const prefixes = prefixOptions.map((opt) =>
  opt.prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
) // escape any special chars
const prefixPattern = prefixes.join('|') // e.g. 'GO:|UNIPROTKB:'
const validationRegex = new RegExp(`^(${prefixPattern})?[A-Z0-9]+$`, 'i')

export function ObjectIdFilterContent() {
  const { t } = useI18n()
  const { prefixValue, setPrefixValue, setInputDropdownValue } =
    usePrefixValueContext()
  return (
    <RegexFilter
      id="object-id-input"
      title={`${t('filterByObjectId')}:`}
      label={t('objectId')}
      queryParam={QueryParams.ObjectId}
      regex={validationRegex}
      prefixOptions={prefixOptions}
      displayNormalizer={(value) => {
        return value
      }}
      paramNormalizer={(value) => {
        if (!prefixValue) {
          return value
        }
        // if the value has a prefix and it is the same as the selected prefix, keep it
        if (value.toLowerCase().startsWith(prefixValue.prefix.toLowerCase())) {
          const id = value.split(':')[1]
          if (prefixValue.prefix === 'UniProtKB:') {
            // if the prefix is UniProtKB, we need to make the id uppercase (e.g. P01267)
            return `${prefixValue.prefix}${id.toUpperCase()}`
          }
          return `${prefixValue.prefix}${id}`
        }

        // If the value has a different prefix from the list, update the selected prefix
        const matchingPrefix = prefixOptions.find((prefixOption) =>
          value.toLowerCase().startsWith(prefixOption.prefix.toLowerCase()),
        )

        if (matchingPrefix) {
          setPrefixValue(matchingPrefix)
          setInputDropdownValue(matchingPrefix.name)
          const id = value.split(':')[1]
          if (matchingPrefix.prefix === 'UniProtKB:') {
            return `${matchingPrefix.prefix}${id.toUpperCase()}`
          }
          return `${matchingPrefix.prefix}${id}`
        }

        // if the value has no prefix, add the selected prefix
        if (value.match(validationRegex)) {
          return `${prefixValue.prefix}${value}`
        }
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
