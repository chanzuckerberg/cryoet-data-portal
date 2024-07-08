import { Button, Icon } from '@czi-sds/components'
import { sum } from 'lodash-es'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { I18n } from 'app/components/I18n'
import { InlineMetadata } from 'app/components/InlineMetadata'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { PageHeader } from 'app/components/PageHeader'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { MetadataTable } from 'app/components/Table'
import { TiltSeriesQualityScoreBadge } from 'app/components/TiltSeriesQualityScoreBadge'
import { ViewTomogramButton } from 'app/components/ViewTomogramButton'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { getTiltRangeLabel } from 'app/utils/tiltSeries'

interface FileSummaryData {
  key: string
  value: number
}

function FileSummary({ data }: { data: FileSummaryData[] }) {
  const { t } = useI18n()
  return (
    <InlineMetadata
      label={t('fileSummary')}
      fields={data.map(({ key, value }) => ({
        key,
        value: t('fileCount', { count: value }),
      }))}
    />
  )
}

export function RunHeader() {
  const { run } = useRunById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()

  const tiltSeries = run.tiltseries[0]

  const tomogram = run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)
  const keyPhotoURL = tomogram?.key_photo_url
  const neuroglancerConfig = tomogram?.neuroglancer_config

  const { openTomogramDownloadModal } = useDownloadModalQueryParamState()

  return (
    <PageHeader
      actions={
        <>
          <ViewTomogramButton
            neuroglancerConfig={neuroglancerConfig}
            buttonProps={{
              sdsStyle: 'rounded',
              sdsType: 'primary',
              startIcon: <Icon sdsIcon="table" sdsType="button" sdsSize="s" />,
            }}
            event={{
              datasetId: run.dataset.id,
              organism: run.dataset.organism_name ?? 'None',
              runId: run.id,
              tomogramId: tomogram?.id ?? 'None',
              type: 'run',
            }}
          />

          <Button
            startIcon={<Icon sdsIcon="download" sdsType="button" sdsSize="l" />}
            sdsType="secondary"
            sdsStyle="rounded"
            onClick={() =>
              openTomogramDownloadModal({
                datasetId: run.dataset.id,
                runId: run.id,
              })
            }
          >
            {t('downloadWithAdditionalOptions')}
          </Button>
        </>
      }
      releaseDate={run.dataset.release_date}
      lastModifiedDate={
        run.dataset.last_modified_date ?? run.dataset.deposition_date
      }
      breadcrumbs={<Breadcrumbs variant="run" dataset={run.dataset} />}
      metadata={[{ key: t('runId'), value: `${run.id}` }]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Run)}
      title={run.name}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-auto gap-sds-xxl p-sds-xl">
          <div className="max-w-[465px] max-h-[330px] grow overflow-clip rounded-sds-m flex-shrink-0 flex items-center">
            {keyPhotoURL ? (
              <Link to={keyPhotoURL}>
                <KeyPhoto title={run.name} src={keyPhotoURL} />
              </Link>
            ) : (
              <KeyPhoto title={run.name} />
            )}
          </div>

          <div className="flex flex-col gap-sds-xl flex-auto pt-sds-l">
            <PageHeaderSubtitle>{t('runOverview')}</PageHeaderSubtitle>

            <FileSummary
              data={[
                {
                  key: t('frames'),
                  value:
                    run.tiltseries_aggregate.aggregate?.sum?.frames_count ?? 0,
                },
                {
                  key: t('tiltSeries'),
                  value: run.tiltseries_aggregate.aggregate?.count ?? 0,
                },
                {
                  key: t('tomograms'),
                  value: sum(
                    run.tomogram_stats.flatMap(
                      (stats) =>
                        stats.tomograms_aggregate.aggregate?.count ?? 0,
                    ),
                  ),
                },
                {
                  key: t('annotations'),
                  value: sum(
                    run.tomogram_stats.flatMap(
                      (stats) =>
                        stats.annotations_aggregate.aggregate?.count ?? 0,
                    ),
                  ),
                },
              ]}
            />

            <div className="flex gap-sds-xxl flex-col lg:flex-row">
              <MetadataTable
                small
                title={i18n.tiltSeries}
                tableCellLabelProps={{
                  width: { min: 100, max: 100 },
                }}
                data={[
                  {
                    labelTooltip: <I18n i18nKey="tiltSeriesTooltip" />,
                    labelTooltipProps: {
                      arrowPadding: { right: 230 },
                    },
                    label: t('tiltQuality'),
                    // hack to align with score badge
                    labelExtra: <span className="mt-sds-xxxs h-[18px]" />,
                    values:
                      typeof tiltSeries?.tilt_series_quality === 'number'
                        ? [String(tiltSeries.tilt_series_quality)]
                        : [],
                    renderValue: (value) => (
                      <TiltSeriesQualityScoreBadge score={+value} />
                    ),
                  },
                  {
                    label: t('tiltRange'),
                    values:
                      typeof tiltSeries?.tilt_min === 'number' &&
                      typeof tiltSeries?.tilt_max === 'number'
                        ? [
                            getTiltRangeLabel(
                              t,
                              tiltSeries.tilt_min,
                              tiltSeries.tilt_max,
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
                small
                title={i18n.tomogram}
                tableCellLabelProps={{ width: { min: 100, max: 180 } }}
                data={[
                  {
                    label: i18n.resolutionsAvailable,
                    inline: true,
                    values: run.tomogram_stats
                      .flatMap((stats) => stats.tomogram_resolutions)
                      .map((resolutions) =>
                        t('unitAngstrom', { value: resolutions.voxel_spacing }),
                      ),
                  },
                  {
                    label: i18n.tomogramProcessing,
                    values: run.tomogram_stats
                      .flatMap((stats) => stats.tomogram_processing)
                      .map((tomo) => tomo.processing),
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

            {moreInfo}
          </div>
        </div>
      )}
    />
  )
}
