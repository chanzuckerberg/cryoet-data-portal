import { Button, Icon } from '@czi-sds/components'
import { sum } from 'lodash-es'

import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { PageHeader } from 'app/components/PageHeader'
import { MetadataTable } from 'app/components/Table'
import { TiltSeriesQualityScoreBadge } from 'app/components/TiltSeriesQualityScoreBadge'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { useDrawer } from 'app/state/drawer'

export function RunHeader() {
  const { run } = useRunById()
  const drawer = useDrawer()
  const { t } = useI18n()

  const tiltSeries = run.tiltseries[0]
  const keyPhotoURL =
    run.tomogram_voxel_spacings[0]?.tomograms[0]?.key_photo_url

  const { openTomogramDownloadModal } = useDownloadModalQueryParamState()
  const neuroglancerConfig = run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)
    ?.neuroglancer_config

  return (
    <PageHeader
      actions={
        <>
          {neuroglancerConfig && (
            <Button
              to={`https://neuroglancer-demo.appspot.com/#!${encodeURIComponent(
                neuroglancerConfig,
              )}`}
              startIcon={<Icon sdsIcon="table" sdsType="button" sdsSize="s" />}
              sdsType="primary"
              sdsStyle="rounded"
              component={Link}
            >
              <span>{t('viewTomogram')}</span>
            </Button>
          )}

          <Button
            startIcon={<Icon sdsIcon="download" sdsType="button" sdsSize="l" />}
            sdsType="primary"
            sdsStyle="rounded"
            onClick={openTomogramDownloadModal}
          >
            {t('download')}...
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
      title={run.name}
    >
      <div className="flex gap-sds-xxl p-sds-xl border-t-[3px] border-sds-gray-200">
        <div className="max-w-[300px] max-h-[213px] grow overflow-clip rounded-sds-m flex-shrink-0">
          {keyPhotoURL ? (
            <Link to={keyPhotoURL}>
              <KeyPhoto title={run.name} src={keyPhotoURL} />
            </Link>
          ) : (
            <KeyPhoto title={run.name} />
          )}
        </div>

        <div className="flex flex-1 gap-sds-xxl flex-col lg:flex-row">
          <MetadataTable
            title={i18n.tiltSeries}
            data={[
              {
                labelTooltip: <I18n i18nKey="tiltSeriesTooltip" />,
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
                  .flatMap((stats) => stats.tomogram_processing)
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
