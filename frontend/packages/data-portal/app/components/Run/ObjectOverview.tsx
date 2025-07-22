import { Icon } from '@czi-sds/components'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { Tooltip } from 'app/components/Tooltip'
import { useI18n } from 'app/hooks/useI18n'
// import { useRunById } from 'app/hooks/useRunById'

export function ObjectOverview() {
  // const { run } = useRunById()
  const { t } = useI18n()

  // Mock data for demonstration with custom titles and IDs
  const mockVerifiedAnnotatedObjects = [
    {
      id: 'ribosome-1',
      title: 'Ribosome (80S)',
      data: [
        {
          label: t('objectName'),
          values: ['Ribosome'],
        },
        {
          label: t('objectId'),
          values: ['GO:0005840'],
        },
        {
          label: t('objectState'),
          values: ['Verified'],
        },
        {
          label: t('objectDescription'),
          values: [
            'A cytoplasmic ribonucleoprotein complex responsible for protein synthesis.',
          ],
        },
      ],
    },
    {
      id: 'proteasome-1',
      title: 'Proteasome (26S)',
      data: [
        {
          label: t('objectName'),
          values: ['Proteasome'],
        },
        {
          label: t('objectId'),
          values: ['GO:0000502'],
        },
        {
          label: t('objectState'),
          values: ['Verified'],
        },
        {
          label: t('objectDescription'),
          values: [
            'A large protein complex that degrades proteins tagged for destruction.',
          ],
        },
      ],
    },
  ]

  const mockVerifiedNonAnnotatedObjects = [
    {
      id: 'mitochondria-1',
      title: 'Mitochondria',
      data: [
        {
          label: t('objectName'),
          values: ['Mitochondria'],
        },
        {
          label: t('objectId'),
          values: ['GO:0005739'],
        },
        {
          label: t('objectState'),
          values: ['Verified'],
        },
        {
          label: t('objectDescription'),
          values: [
            'A double-membrane organelle responsible for cellular respiration.',
          ],
        },
      ],
    },
    {
      id: 'er-1',
      title: 'Endoplasmic Reticulum',
      data: [
        {
          label: t('objectName'),
          values: ['Endoplasmic Reticulum'],
        },
        {
          label: t('objectId'),
          values: ['GO:0005783'],
        },
        {
          label: t('objectState'),
          values: ['Verified'],
        },
        {
          label: t('objectDescription'),
          values: [
            'A continuous membrane system that forms a network of tubules and flattened sacs.',
          ],
        },
      ],
    },
  ]

  const mockUnverifiedAnnotatedObjects = [
    {
      id: 'unknown-particle-a',
      title: 'Unknown Particle A',
      data: [
        {
          label: t('objectName'),
          values: ['Unknown Particle A'],
        },
        {
          label: t('objectId'),
          values: ['UNK:001'],
        },
        {
          label: t('objectState'),
          values: ['Unverified'],
        },
        {
          label: t('objectDescription'),
          values: [
            'An unidentified particle structure requiring further validation.',
          ],
        },
      ],
    },
    {
      id: 'unknown-particle-b',
      title: 'Unknown Particle B',
      data: [
        {
          label: t('objectName'),
          values: ['Unknown Particle B'],
        },
        {
          label: t('objectId'),
          values: ['UNK:002'],
        },
        {
          label: t('objectState'),
          values: ['Unverified'],
        },
        {
          label: t('objectDescription'),
          values: [
            'A spherical structure of unknown composition and function.',
          ],
        },
      ],
    },
  ]

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
      <AccordionMetadataTable
        id="verified-objects-annotated"
        header={createAccordionHeader(
          t('verifiedObjectsAnnotated'),
          t('verifiedObjectsAnnotatedTooltip'),
        )}
        data={mockVerifiedAnnotatedObjects}
        initialOpen={false}
        multipleTables
      />

      <AccordionMetadataTable
        id="verified-objects-non-annotated"
        header={createAccordionHeader(
          t('verifiedObjectsNonAnnotated'),
          t('verifiedObjectsNonAnnotatedTooltip'),
        )}
        data={mockVerifiedNonAnnotatedObjects}
        initialOpen={false}
        multipleTables
      />

      <AccordionMetadataTable
        id="unverified-objects-annotated"
        header={createAccordionHeader(
          t('unverifiedObjectsAnnotated'),
          t('unverifiedObjectsAnnotatedTooltip'),
        )}
        data={mockUnverifiedAnnotatedObjects}
        initialOpen={false}
        multipleTables
      />
    </div>
  )
}
