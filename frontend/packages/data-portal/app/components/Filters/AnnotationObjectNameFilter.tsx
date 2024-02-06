import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { BaseFilterOption } from 'app/types/filter'

import { SelectFilter } from './SelectFilter'

function getObjectNameOptions(objectNames: string[]): BaseFilterOption[] {
  return objectNames.map((name) => ({
    label: name,
    value: name,
  }))
}

export function AnnotatedObjectNameFilter({
  allObjectNames,
  label,
}: {
  allObjectNames: string[]
  label: string
}) {
  const {
    updateValue,
    annotation: { objectNames },
  } = useFilter()

  const objectNameOptions = useMemo(
    () => getObjectNameOptions(allObjectNames),
    [allObjectNames],
  )

  const objectNameValue = useMemo(
    () => getObjectNameOptions(objectNames),
    [objectNames],
  )

  return (
    <SelectFilter
      multiple
      label={label}
      onChange={(options) => updateValue(QueryParams.ObjectName, options)}
      options={objectNameOptions}
      value={objectNameValue}
    />
  )
}
