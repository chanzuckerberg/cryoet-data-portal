import { Button, Icon } from '@czi-sds/components'
import { sum } from 'lodash-es'

import { Link } from 'app/components/Link'
import { PageHeader } from 'app/components/PageHeader'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { useDrawer } from 'app/state/drawer'

import { KeyPhoto } from '../KeyPhoto'
import { MetadataTable } from '../Table'
import { TiltSeriesQualityScoreBadge } from '../TiltSeriesQualityScoreBadge'

export function RunHeader() {
  const { run } = useRunById()
  const drawer = useDrawer()

  const tiltSeries = run.tiltseries[0]
  const keyPhotoURL = 'https://loremflickr.com/400/400/cat'

  return (
    <PageHeader
      actions={
        <>
          <Button
            startIcon={<Icon sdsIcon="table" sdsType="button" sdsSize="s" />}
            sdsType="primary"
            sdsStyle="rounded"
          >
            View Tomogram
          </Button>

          <Button
            startIcon={<Icon sdsIcon="download" sdsType="button" sdsSize="l" />}
            endIcon={
              <Icon sdsIcon="chevronDown" sdsType="button" sdsSize="s" />
            }
            sdsType="secondary"
            sdsStyle="rounded"
          >
            Download
          </Button>
        </>
      }
      backToResultsLabel={run.dataset.title}
      lastModifiedDate="2023-12-16"
      metadata={[
        // TODO fetch frames from API
        { key: i18n.frames, value: i18n.nFiles(0) },

        {
          key: i18n.tiltSeries,
          value: i18n.nFiles(run.tiltseries_aggregate.aggregate?.count ?? 0),
        },

        {
          key: i18n.tomograms,
          value: i18n.nFiles(
            sum(
              run.tomogram_stats.flatMap(
                (stats) => stats.tomograms_aggregate.aggregate?.count ?? 0,
              ),
            ),
          ),
        },

        {
          key: i18n.annotations,
          value: i18n.nFiles(
            sum(
              run.tomogram_stats.flatMap(
                (stats) => stats.annotations_aggregate.aggregate?.count ?? 0,
              ),
            ),
          ),
        },
      ]}
      onMoreInfoClick={() => drawer.setActiveDrawerId('run-metadata')}
      // TODO add release date data
      releaseDate="2023-09-30"
      title={run.name}
    >
      <div className="flex gap-sds-xxl p-sds-xl border-t-[3px] border-sds-gray-200">
        <div className="max-w-[300px] max-h-[212px] flex-shrink-0">
          <Link to={keyPhotoURL}>
            <KeyPhoto title={run.name} src={keyPhotoURL} />
          </Link>
        </div>

        <div className="flex gap-sds-xxl flex-col lg:flex-row">
          <MetadataTable
            title={i18n.tiltSeries}
            data={[
              {
                label: i18n.tiltQuality,
                values:
                  typeof tiltSeries?.tilt_series_quality === 'number'
                    ? [String(tiltSeries.tilt_series_quality)]
                    : [],
                renderValue: (value) => (
                  <TiltSeriesQualityScoreBadge score={+value} />
                ),
              },
              {
                label: i18n.tiltRange,
                values:
                  typeof tiltSeries?.tilt_min === 'number' &&
                  typeof tiltSeries?.tilt_max === 'number'
                    ? [
                        i18n.valueToValue(
                          i18n.unitDegree(tiltSeries.tilt_min),
                          i18n.unitDegree(tiltSeries.tilt_max),
                        ),
                      ]
                    : [],
              },
              {
                label: i18n.tiltScheme,
                values: tiltSeries?.tilting_scheme
                  ? [tiltSeries.tilting_scheme]
                  : [],
              },
            ]}
          />

          <MetadataTable
            title={i18n.tomogram}
            data={[
              {
                label: i18n.resolutionsAvailable,
                values: ['10.00Å, 13.70Å'],
              },
              {
                label: i18n.tomogramProcessing,
                values: run.tomogram_stats
                  .flatMap((stats) => stats.tomograms)
                  .map((tomogram) => tomogram.processing),
              },
              {
                label: i18n.annotatedObjects,
                inline: true,
                values: run.tomogram_stats
                  .flatMap((stats) => stats.annotations)
                  .map((annotation) => annotation.object_name),
              },
            ]}
          />
        </div>
      </div>
    </PageHeader>
  )
}
