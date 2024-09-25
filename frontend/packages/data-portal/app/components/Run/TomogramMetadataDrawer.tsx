import { useAtom } from 'jotai'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseEntryList } from 'app/components/DatabaseEntry'
import { Link } from 'app/components/Link'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { metadataDrawerTomogramAtom } from 'app/state/metadataDrawerTomogram'
import { getTableData } from 'app/utils/table'
import { getTomogramName, isFiducial } from 'app/utils/tomograms'

import { Matrix4x4 } from './Matrix4x4'

export function TomogramMetadataDrawer() {
  const { t } = useI18n()
  const [tomogram] = useAtom(metadataDrawerTomogramAtom)

  if (tomogram === undefined) {
    return null
  }

  return (
    <MetadataDrawer
      title={getTomogramName(tomogram)}
      label={t('tomogramDetails')}
      idInfo={{
        label: 'tomogramId',
        text: `${IdPrefix.Tomogram}-${tomogram.id}`,
      }}
      disabled={tomogram === undefined}
      drawerId={MetadataDrawerId.Tomogram}
    >
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
            values: [], // TODO
            renderValue: (value: string) => (
              <DatabaseEntryList entries={value} />
            ),
          },
          {
            label: t('relatedDatabases'),
            values: [], // TODO
            renderValue: (value: string) => (
              <DatabaseEntryList entries={value} />
            ),
          },
          {
            label: t('depositionName'),
            values: [tomogram.deposition?.depositionTitle ?? ''],
            renderValue: (value: string) => (
              <Link
                className="text-sds-color-primitive-blue-400"
                to={`/deposition/${tomogram.deposition?.id}`}
              >
                {value}
              </Link>
            ),
          },
          {
            label: t('depositionId'),
            values: [tomogram.deposition?.id ?? ''],
          },
          {
            label: t('depositionDate'),
            values: [tomogram.deposition?.depositionDate ?? ''],
          },
          {
            label: t('releaseDate'),
            values: [], // TODO
          },
          {
            label: t('lastModifiedDate'),
            values: [], // TODO
          },
        )}
      />
      <AccordionMetadataTable
        header={t('reconstructionAndProcessing')}
        id="reconstruction-processing"
        data={getTableData(
          {
            label: t('portalStandardStatus'),
            values: [], // TODO
          },
          {
            label: t('submittedByDatasetAuthor'),
            values: [], // TODO
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
              <div className="text-sds-header-xxs font-normal">
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
                <li className="text-sds-header-xxs font-normal">{values[1]}</li>
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
            values: [], // TODO
          },
          {
            label: t('canonicalStatus'),
            values: [], // TODO
          },
          {
            label: t('alignmentType'),
            values: [], // TODO
          },
          {
            label: t('dimensionXYZ'),
            values: [], // TODO
          },
          {
            label: t('offsetXYZ'),
            values: [], // TODO
          },
          {
            label: t('rotationX'),
            values: [], // TODO
          },
          {
            label: t('tileOffset'),
            values: [], // TODO
          },
          {
            label: t('affineTransformationMatrix'),
            values: [], // TODO
            renderValue: (value) => {
              return <Matrix4x4 matrix={String(value)} />
            },
          },
        )}
      />
    </MetadataDrawer>
  )
}
