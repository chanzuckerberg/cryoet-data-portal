import { useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'

function getAnnotationSoftwareOptions(
  annotationSoftwares: string[],
): BaseFilterOption[] {
  return annotationSoftwares.map((name) => ({
    label: name,
    value: name,
  }))
}

export function AnnotationSoftwareFilter({
  allAnnotationSoftwares,
}: {
  allAnnotationSoftwares: string[]
}) {
  const { t } = useI18n()

  const {
    updateValue,
    annotation: { annotationSoftwares },
  } = useFilter()

  const annotationSoftwareOptions = useMemo(
    () => getAnnotationSoftwareOptions(allAnnotationSoftwares),
    [allAnnotationSoftwares],
  )

  const annotationSoftwareValue = useMemo(
    () => getAnnotationSoftwareOptions(annotationSoftwares),
    [annotationSoftwares],
  )

  return (
    <SelectFilter
      multiple
      label={t('annotationSoftware')}
      onChange={(options) =>
        updateValue(QueryParams.AnnotationSoftware, options)
      }
      options={annotationSoftwareOptions}
      value={annotationSoftwareValue}
    />
  )
}
