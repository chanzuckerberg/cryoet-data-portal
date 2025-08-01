import { Icon } from '@czi-sds/components'
import { useAtom } from 'jotai'

import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { metadataDrawerTomogramAtom } from 'app/state/metadataDrawerTomogram'
import { getTableData } from 'app/utils/table'
import { getTomogramNameFromV2, isFiducial } from 'app/utils/tomograms'

import { AccordionMetadataTable } from '../AccordionMetadataTable'
import { AuthorLegend } from '../AuthorLegend'
import { AuthorList } from '../AuthorList'
import { DatabaseEntryList } from '../DatabaseEntry'
import { I18n } from '../I18n'
import { Link } from '../Link'
import { MetadataDrawer } from '../MetadataDrawer'
import { Tooltip } from '../Tooltip'
import { IDENTITY_MATRIX_4X4, Matrix4x4 } from './Matrix4x4'

export function TomogramMetadataDrawer() {
  const { t } = useI18n()
  const [tomogram] = useAtom(metadataDrawerTomogramAtom)

  if (tomogram === undefined) {
    return null
  }

  return (
    <MetadataDrawer
      title={getTomogramNameFromV2(tomogram)}
      label={t('tomogramDetails')}
      idInfo={{
        label: 'tomogramId',
        text: `${IdPrefix.Tomogram}-${tomogram.id}`,
      }}
      disabled={tomogram === undefined}
      drawerId={MetadataDrawerId.Tomogram}
      MetadataTabComponent={MetadataTab}
    />
  )
}

function MetadataTab() {
  const { t } = useI18n()
  const [tomogram] = useAtom(metadataDrawerTomogramAtom)
  const { run } = useRunById()

  if (tomogram === undefined) {
    return null
  }

  const { alignment } = tomogram

  return (
    <>
      <AccordionMetadataTable
        header={t('tomogramOverview')}
        id="tomogram-overview"
        data={getTableData(
          {
            label: t('authors'),
            labelExtra: <AuthorLegend inline />,
            renderValue: () => {
              return (
                <AuthorList
                  authors={tomogram.authors.edges.map((edge) => edge.node)}
                  large
                />
              )
            },
            values: [],
            className: 'leading-sds-body-s',
          },
          {
            label: t('publications'),
            values: [run.dataset?.datasetPublications ?? ''],
            renderValue: (value: string) => (
              <DatabaseEntryList entries={value} />
            ),
          },
          {
            label: t('relatedDatabases'),
            values: [tomogram.relatedDatabaseEntries ?? ''],
            renderValue: (value: string) => (
              <DatabaseEntryList entries={value} />
            ),
          },
          {
            label: t('depositionName'),
            values: [tomogram.deposition?.title ?? ''],
            renderValue: (value: string) => (
              <Link
                className="text-light-sds-color-primitive-blue-500"
                to={`/depositions/${tomogram.deposition?.id}`}
              >
                {value}
              </Link>
            ),
          },
          {
            label: t('depositionId'),
            values: [
              tomogram.deposition?.id !== undefined
                ? `${IdPrefix.Deposition}-${tomogram.deposition.id}`
                : '',
            ],
          },
          {
            label: t('depositionDate'),
            values: [tomogram.deposition?.depositionDate.split('T')[0] ?? ''],
          },
          {
            label: t('releaseDate'),
            values: [tomogram.releaseDate?.split('T')[0] ?? ''],
          },
          {
            label: t('lastModifiedDate'),
            values: [tomogram.lastModifiedDate?.split('T')[0] ?? ''],
          },
        )}
      />
      <AccordionMetadataTable
        header={t('reconstructionAndProcessing')}
        id="reconstruction-processing"
        data={getTableData(
          {
            label: t('portalStandardStatus'),
            values: [tomogram.isPortalStandard ? 'True' : 'False'],
          },
          {
            label: t('submittedByDatasetAuthor'),
            values: [tomogram.isAuthorSubmitted ? 'True' : 'False'],
          },
          {
            label: t('reconstructionSoftware'),
            values: [tomogram.reconstructionSoftware],
          },
          {
            label: t('reconstructionMethod'),
            values: [tomogram.reconstructionMethod],
          },
          {
            label: t('processingSoftware'),
            values: [tomogram.processingSoftware ?? ''],
          },
          {
            label: t('processing'),
            values: [tomogram.processing],
          },
          {
            label: t('voxelSpacing'),
            subLabel: (
              <div className="text-sds-header-xxs-600-wide font-normal text-light-sds-color-semantic-neutral-text">
                {t('sizeXYZ')}
              </div>
            ),
            values: [
              t('unitAngstrom', { value: tomogram.voxelSpacing }),
              `(${tomogram.sizeX}, ${tomogram.sizeY}, ${tomogram.sizeZ})px`,
            ],
            renderValues: (values: string[]) => (
              <ul className="list-none">
                <li className="leading-[20px]">{values[0]}</li>
                <li className="text-sds-header-xxs-600-wide font-normal text-light-sds-color-semantic-neutral-text">
                  {values[1]}
                </li>
              </ul>
            ),
          },
          {
            label: t('fiducialAlignmentStatus'),
            values: [
              isFiducial(tomogram.fiducialAlignmentStatus)
                ? t('true')
                : t('false'),
            ],
          },
          {
            label: t('ctfCorrected'),
            values: [tomogram.ctfCorrected ? t('yes') : t('no')],
          },
        )}
      />
      <AccordionMetadataTable
        header={t('alignment')}
        id="alignment"
        data={getTableData(
          {
            label: t('alignmentId'),
            labelExtra: (
              <Tooltip
                tooltip={<I18n i18nKey="alignmentIdTooltip" />}
                placement="top"
              >
                <Icon
                  sdsIcon="InfoCircle"
                  sdsSize="s"
                  className="!fill-light-sds-color-primitive-gray-500"
                />
              </Tooltip>
            ),
            values: [
              alignment?.id != null
                ? `${IdPrefix.Alignment}-${alignment.id}`
                : '',
            ],
          },
          {
            label: t('portalStandardStatus'),
            values: [tomogram.isPortalStandard ? 'True' : 'False'],
            labelExtra: (
              <Tooltip
                tooltip={<I18n i18nKey="alignmentIdStandardTooltip" />}
                placement="top"
              >
                <Icon
                  sdsIcon="InfoCircle"
                  sdsSize="s"
                  className="!fill-light-sds-color-primitive-gray-500"
                />
              </Tooltip>
            ),
          },
          {
            label: t('alignmentType'),
            values: [alignment?.alignmentType ?? ''],
          },
          {
            label: t('dimensionXYZ'),
            values: [
              alignment?.volumeXDimension != null &&
              alignment.volumeYDimension != null &&
              alignment.volumeZDimension != null
                ? t('unitAngstrom', {
                    value: `(${alignment.volumeXDimension}, ${alignment.volumeYDimension}, ${alignment.volumeZDimension}) `,
                  })
                : '',
            ],
          },
          {
            label: t('offsetXYZ'),
            values: [
              alignment?.volumeXOffset != null &&
              alignment.volumeYOffset != null &&
              alignment.volumeZOffset != null
                ? t('unitAngstrom', {
                    value: `(${alignment.volumeXOffset}, ${alignment.volumeYOffset}, ${alignment.volumeZOffset}) `,
                  })
                : '',
            ],
          },
          {
            label: t('rotationX'),
            values: [
              alignment?.xRotationOffset != null
                ? t('unitDegree', { value: alignment?.xRotationOffset })
                : '',
            ],
          },
          {
            label: t('tiltOffset'),
            values: [
              alignment?.tiltOffset != null
                ? t('unitDegree', { value: alignment.tiltOffset })
                : '',
            ],
          },
          {
            label: t('affineTransformationMatrix'),
            values: [
              parseAffineTransformationMatrix(
                alignment?.affineTransformationMatrix,
              ) ?? IDENTITY_MATRIX_4X4,
            ],
            renderValue: (value: string) => {
              return <Matrix4x4 matrix={value} />
            },
          },
        )}
      />
    </>
  )
}

function parseAffineTransformationMatrix(
  json?: string | null,
): string | undefined {
  if (json == null) {
    return undefined
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(json)
    if (Array.isArray(parsed)) {
      return parsed.flat().join(' ')
    }
  } catch {
    return undefined
  }

  return undefined
}
