import { Icon } from '@czi-sds/components'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { ObjectIdLink } from 'app/components/ObjectIdLink'
import { Tooltip } from 'app/components/Tooltip'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'

export function ObjectOverview() {
  const { annotatedObjectsData, identifiedObjectsData } = useRunById()
  const { t } = useI18n()

  const identifiedObjectNames = identifiedObjectsData
    .map((obj) => obj?.objectName)
    .filter((name): name is string => Boolean(name))

  const annotatedObjectNames = annotatedObjectsData
    .map((obj) => obj?.objectName)
    .filter((name): name is string => Boolean(name))

  // Helper function to create object data structure
  const createObjectData = (
    objectName: string,
    index: number,
    objectData?: {
      objectId?: string | null
      objectState?: string | null
      objectDescription?: string | null
    },
  ) => ({
    // Suffix with the index so distinct objects that share a name (e.g. same
    // name with different descriptions) get unique React keys.
    id: `${objectName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    title: `Object ${index}`,
    data: [
      {
        label: t('objectName'),
        values: [objectName],
      },
      {
        label: t('objectId'),
        values: [objectData?.objectId ?? '--'],
        renderValue: (value: string) =>
          value === '--' ? value : <ObjectIdLink id={value} />,
      },
      {
        label: t('objectState'),
        values: [objectData?.objectState ?? '--'],
      },
      {
        label: t('objectDescription'),
        values: [objectData?.objectDescription ?? '--'],
      },
    ],
  })
  // Each object is identified by all 4 fields (name, id, state, description),
  // so we iterate the deduped object rows directly — this keeps each row's own
  // description/state on its card and counts distinct objects (not just names).

  // Verified Objects Annotated = Objects present in BOTH identifiedObjects and annotatedObjects
  const verifiedAnnotatedObjects = annotatedObjectsData
    .filter(
      (obj) =>
        obj?.objectName && identifiedObjectNames.includes(obj.objectName),
    )
    .map((obj, index) => createObjectData(obj.objectName ?? '', index + 1, obj))

  // Verified Objects Unannotated = Objects only in identifiedObjects (not in annotatedObjects)
  const verifiedNonAnnotatedObjects = identifiedObjectsData
    .filter(
      (obj) =>
        obj?.objectName && !annotatedObjectNames.includes(obj.objectName),
    )
    .map((obj, index) => createObjectData(obj.objectName ?? '', index + 1, obj))

  // Unverified Objects Annotated = Objects only in annotatedObjects (not in identifiedObjects)
  const unverifiedAnnotatedObjects = annotatedObjectsData
    .filter(
      (obj) =>
        obj?.objectName && !identifiedObjectNames.includes(obj.objectName),
    )
    .map((obj, index) => createObjectData(obj.objectName ?? '', index + 1, obj))

  const createAccordionHeader = (title: string, tooltipText: string) => (
    <div className="flex items-center gap-sds-xxs">
      <span className="font-semibold">{title}</span>
      <Tooltip
        tooltip={tooltipText}
        placement="top"
        sdsStyle="light"
        offset={[0, -8]}
      >
        <Icon
          sdsIcon="InfoCircle"
          sdsSize="xs"
          className="!fill-light-sds-color-primitive-gray-500"
        />
      </Tooltip>
    </div>
  )

  return (
    <div className="divide-y divide-light-sds-color-primitive-gray-300">
      {verifiedAnnotatedObjects.length > 0 && (
        <AccordionMetadataTable
          id="verified-objects-annotated"
          header={createAccordionHeader(
            t('verifiedObjectsAnnotated'),
            t('verifiedObjectsAnnotatedTooltip'),
          )}
          data={verifiedAnnotatedObjects}
          initialOpen={false}
          multipleTables
        />
      )}

      {verifiedNonAnnotatedObjects.length > 0 && (
        <AccordionMetadataTable
          id="verified-objects-non-annotated"
          header={createAccordionHeader(
            t('verifiedObjectsNonAnnotated'),
            t('verifiedObjectsNonAnnotatedTooltip'),
          )}
          data={verifiedNonAnnotatedObjects}
          initialOpen={false}
          multipleTables
        />
      )}

      {unverifiedAnnotatedObjects.length > 0 && (
        <AccordionMetadataTable
          id="unverified-objects-annotated"
          header={createAccordionHeader(
            t('unverifiedObjectsAnnotated'),
            t('unverifiedObjectsAnnotatedTooltip'),
          )}
          data={unverifiedAnnotatedObjects}
          initialOpen={false}
          multipleTables
        />
      )}
    </div>
  )
}
