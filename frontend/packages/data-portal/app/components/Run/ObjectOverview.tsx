import { Icon } from '@czi-sds/components'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { Tooltip } from 'app/components/Tooltip'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'

export function ObjectOverview() {
  const { objectNames, annotatedObjectsData, identifiedObjectsData } =
    useRunById()
  const { t } = useI18n()

  const identifiedObjectNames = identifiedObjectsData
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
    id: objectName.toLowerCase().replace(/\s+/g, '-'),
    title: `Object ${index}`,
    data: [
      {
        label: t('objectName'),
        values: [objectName],
      },
      {
        label: t('objectId'),
        values: [objectData?.objectId ?? '--'],
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
  // Verified Objects Annotated = Objects present in BOTH identifiedObjects and annotatedObjects
  const verifiedAnnotatedObjects = objectNames
    .filter(
      (name): name is string =>
        Boolean(name) && identifiedObjectNames.includes(name),
    )
    .map((name, index) => {
      const annotatedData = annotatedObjectsData.find(
        (obj) => obj?.objectName === name,
      )
      const identifiedData = identifiedObjectsData.find(
        (obj) => obj?.objectName === name,
      )
      return createObjectData(name, index + 1, identifiedData || annotatedData)
    })

  // Verified Objects Unannotated = Objects only in identifiedObjects (not in annotatedObjects)
  const verifiedNonAnnotatedObjects = identifiedObjectNames
    .filter(
      (name): name is string => Boolean(name) && !objectNames.includes(name),
    )
    .map((name, index) => {
      const identifiedData = identifiedObjectsData.find(
        (obj) => obj?.objectName === name,
      )
      return createObjectData(name, index + 1, identifiedData)
    })

  // Unverified Objects Annotated = Objects only in annotatedObjects (not in identifiedObjects)
  const unverifiedAnnotatedObjects = objectNames
    .filter(
      (name): name is string =>
        Boolean(name) && !identifiedObjectNames.includes(name),
    )
    .map((name, index) => {
      const annotatedData = annotatedObjectsData.find(
        (obj) => obj?.objectName === name,
      )
      return createObjectData(name, index + 1, annotatedData)
    })

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
