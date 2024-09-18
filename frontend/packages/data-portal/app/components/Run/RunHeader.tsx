import { Button, Icon } from '@czi-sds/components'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { I18n } from 'app/components/I18n'
import { InlineMetadata } from 'app/components/InlineMetadata'
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
import { TableDataValue } from 'app/types/table'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { getTiltRangeLabel } from 'app/utils/tiltSeries'

import { CollapsibleList } from '../CollapsibleList'
import { HeaderKeyPhoto } from '../HeaderKeyPhoto'

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
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')
  const {
    run,
    processingMethods,
    objectNames,
    resolutions,
    annotationFilesAggregates,
    tomogramsCount,
  } = useRunById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()

  const tiltSeries = run.tiltseries[0]

  const tomogram = run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)
  const keyPhotoURL = tomogram?.key_photo_url ?? undefined
  const neuroglancerConfig = tomogram?.neuroglancer_config

  const { openRunDownloadModal } = useDownloadModalQueryParamState()

  const framesCount = run.tiltseries_aggregate.aggregate?.sum?.frames_count ?? 0
  const tiltSeriesCount = run.tiltseries_aggregate.aggregate?.count ?? 0
  const annotationsCount = annotationFilesAggregates.totalCount

  return (
    <PageHeader
      actions={
        <div className="flex items-center gap-2.5">
          <ViewTomogramButton
            tomogramId={tomogram?.id?.toString()}
            neuroglancerConfig={neuroglancerConfig}
            buttonProps={{
              sdsStyle: 'rounded',
              sdsType: 'primary',
              startIcon: <Icon sdsIcon="Table" sdsType="button" sdsSize="s" />,
            }}
            tooltipPlacement="bottom"
            event={{
              datasetId: run.dataset.id,
              organism: run.dataset.organism_name ?? 'None',
              runId: run.id,
              tomogramId: tomogram?.id ?? 'None',
              type: 'run',
            }}
          />

          <Button
            startIcon={<Icon sdsIcon="Download" sdsType="button" sdsSize="l" />}
            sdsType="secondary"
            sdsStyle="rounded"
            onClick={() =>
              openRunDownloadModal({
                datasetId: run.dataset.id,
                runId: run.id,
              })
            }
          >
            {t('downloadWithAdditionalOptions')}
          </Button>
        </div>
      }
      releaseDate={run.dataset.release_date}
      lastModifiedDate={
        run.dataset.last_modified_date ?? run.dataset.deposition_date
      }
      breadcrumbs={<Breadcrumbs variant="run" data={run.dataset} />}
      metadata={[{ key: t('runId'), value: `${run.id}` }]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Run)}
      title={run.name}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-auto gap-sds-xxl p-sds-xl">
          <HeaderKeyPhoto title={run.name} url={keyPhotoURL} />

          <div className="flex flex-col gap-sds-xl flex-1 pt-sds-l">
            <PageHeaderSubtitle className="mt-sds-m">
              {t('runOverview')}
            </PageHeaderSubtitle>

            {multipleTomogramsEnabled ? (
              <InlineMetadata
                label={t('dataSummary')}
                fields={[
                  {
                    key: t('frames'),
                    value: framesCount > 0 ? t('available') : t('notSubmitted'),
                    valueClass:
                      framesCount > 0 ? undefined : 'text-sds-gray-500',
                  },
                  {
                    key: t('tiltSeries'),
                    value:
                      tiltSeriesCount > 0 ? t('available') : t('notSubmitted'),
                    valueClass:
                      tiltSeriesCount > 0 ? undefined : 'text-sds-gray-500',
                  },
                  {
                    key: t('alignmentFile'),
                    value: '', // TODO(bchu): Confirm how this should be counted.
                  },
                  {
                    key: t('tomograms'),
                    value: tomogramsCount.toString(),
                  },
                  {
                    key: t('annotations'),
                    value: annotationsCount.toString(),
                  },
                ]}
              />
            ) : (
              <FileSummary
                data={[
                  {
                    key: t('frames'),
                    value: framesCount,
                  },
                  {
                    key: t('tiltSeries'),
                    value: tiltSeriesCount,
                  },
                  {
                    key: t('tomograms'),
                    value: tomogramsCount,
                  },
                  {
                    key: t('annotations'),
                    value: annotationsCount,
                  },
                ]}
              />
            )}

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
                    values: resolutions.map((resolution) =>
                      t('unitAngstrom', { value: resolution }),
                    ),
                  },
                  {
                    label: i18n.tomogramProcessing,
                    values: processingMethods,
                    className: 'capitalize',
                  },
                  {
                    label: i18n.annotatedObjects,
                    inline: true,
                    values: objectNames,
                    renderValues: (values: TableDataValue[]) => (
                      <CollapsibleList
                        entries={values.map((value) => ({
                          key: value.toString(),
                          entry: value.toString(),
                        }))}
                        inlineVariant
                        collapseAfter={6}
                      />
                    ),
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
