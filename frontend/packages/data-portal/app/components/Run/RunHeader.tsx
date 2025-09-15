import { Button, Icon } from '@czi-sds/components'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { CitationButton } from 'app/components/CitationButton'
import { CollapsibleList } from 'app/components/CollapsibleList'
import { HeaderKeyPhoto } from 'app/components/HeaderKeyPhoto'
import { I18n } from 'app/components/I18n'
import { getKeyPhotoCaption } from 'app/components/KeyPhotoCaption/KeyPhotoCaption'
import { PageHeader } from 'app/components/PageHeader'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { MetadataTable } from 'app/components/Table'
import { TiltSeriesQualityScoreBadge } from 'app/components/TiltSeriesQualityScoreBadge'
import { Tooltip } from 'app/components/Tooltip'
import { ViewTomogramButton } from 'app/components/ViewTomogramButton'
import { DATA_TYPES } from 'app/constants/dataTypes'
import { IdPrefix } from 'app/constants/idPrefixes'
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
import { getNeuroglancerUrl } from 'app/utils/url'

import { ContentsSummaryTable } from '../common/ContentsSummaryTable/ContentsSummaryTable'
import { Link } from '../Link'

export function RunHeader() {
  const {
    run,
    processingMethods,
    objectNames,
    identifiedObjectsData,
    resolutions,
    annotationFilesAggregates,
    tomogramsCount,
    alignmentsCount,
    ctfCount,
    tomograms,
  } = useRunById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()
  const isIdentifiedObjectsEnabled = useFeatureFlag('identifiedObjects')

  const tiltSeries = run.tiltseries.edges[0]?.node

  // Use author submitted tomogram if available, otherwise default to the first one
  const tomogramV2 =
    tomograms.find(
      (currentTomogram) => currentTomogram.isVisualizationDefault,
    ) ?? tomograms.at(0)

  const neuroglancerConfig = tomogramV2?.neuroglancerConfig

  const { openRunDownloadModal } = useDownloadModalQueryParamState()

  const framesCount = run.frames.edges.length
  const tiltSeriesCount = run.tiltseriesAggregate?.aggregate?.[0]?.count ?? 0
  const annotationsCount = annotationFilesAggregates.totalCount
  const tomogramId = tomogramV2?.id?.toString()
  return (
    <PageHeader
      actions={
        <div className="flex items-center gap-sds-s">
          <ViewTomogramButton
            tomogramId={tomogramId}
            neuroglancerConfig={neuroglancerConfig}
            buttonProps={{
              sdsStyle: 'rounded',
              sdsType: 'primary',
              startIcon: <Icon sdsIcon="Cube" sdsSize="s" />,
            }}
            tooltipPlacement="bottom"
            event={{
              datasetId: run.dataset?.id ?? 0,
              organism: run.dataset?.organismName ?? 'None',
              runId: run.id,
              tomogramId: tomogramId ?? 'None',
              type: 'run',
            }}
          />

          <Button
            startIcon={<Icon sdsIcon="Download" sdsSize="l" />}
            sdsType="secondary"
            sdsStyle="rounded"
            onClick={() =>
              openRunDownloadModal({
                datasetId: run.dataset?.id,
                runId: run.id,
              })
            }
          >
            {t('downloadWithAdditionalOptions')}
          </Button>

          <CitationButton
            buttonProps={{
              sdsStyle: 'rounded',
              sdsType: 'secondary',
              startIcon: <Icon sdsIcon="Book" sdsSize="s" />,
            }}
            tooltipPlacement="bottom"
            event={{
              cite: true,
            }}
          />
        </div>
      }
      releaseDate={run.dataset?.releaseDate.split('T')[0]}
      lastModifiedDate={run.dataset?.lastModifiedDate.split('T')[0]}
      breadcrumbs={
        run.dataset != null && <Breadcrumbs variant="run" data={run.dataset} />
      }
      metadata={[{ key: t('runId'), value: `${IdPrefix.Run}-${run.id}` }]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Run)}
      title={run.name}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-auto gap-sds-xxl p-sds-xl">
          <HeaderKeyPhoto
            title={run.name}
            url={tomogramV2?.keyPhotoUrl ?? undefined}
            caption={getKeyPhotoCaption({
              type: DATA_TYPES.RUN,
              data: { ...run, tomogramId },
            })}
            overlayContent={
              (neuroglancerConfig && tomogramId && (
                <button
                  type="button"
                  className="w-full h-full flex flex-column justify-center items-center text-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    window.open(getNeuroglancerUrl(neuroglancerConfig))
                  }}
                >
                  <div className="text-light-sds-color-primitive-gray-50">
                    <h3 className="text-sds-body-l-600-wide font-semibold pb-sds-xl">
                      <Icon
                        sdsIcon="Cube"
                        sdsSize="l"
                        color="gray"
                        shade={100}
                        className="mr-sds-xs"
                      />
                      {t('viewTomogram')}
                    </h3>
                    <h4 className="text-sds-header-xs-400-wide pb-sds-xs">
                      {t('viewTomogramInNeuroglancer', {
                        id: `${IdPrefix.Tomogram}-${tomogramId}`,
                      })}
                    </h4>
                    <Link
                      to={t('neuroglancerTutorialLink')}
                      variant="dashed-underlined"
                      stopPropagation
                      className="text-light-sds-color-semantic-base-text-secondary-inverse"
                    >
                      <I18n i18nKey="viewNeuroglancerTutorial" />
                    </Link>
                  </div>
                </button>
              )) ||
              undefined
            }
          />

          <div className="flex-1 flex gap-sds-xxl items-start">
            <div className="flex flex-col gap-sds-xl">
              <PageHeaderSubtitle>{t('runOverview')}</PageHeaderSubtitle>
              <div className="flex gap-sds-xxl flex-col">
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
                        tiltSeries?.tiltSeriesQuality !== undefined
                          ? [String(tiltSeries.tiltSeriesQuality)]
                          : [],
                      renderValue: (value) => (
                        <TiltSeriesQualityScoreBadge score={+value} />
                      ),
                    },
                    {
                      label: t('tiltRange'),
                      values:
                        tiltSeries?.tiltRange !== undefined &&
                        tiltSeries.tiltMin !== undefined &&
                        tiltSeries.tiltMax !== undefined
                          ? [
                              getTiltRangeLabel(
                                t,
                                tiltSeries.tiltRange,
                                tiltSeries.tiltMin,
                                tiltSeries.tiltMax,
                              ),
                            ]
                          : [],
                    },
                    {
                      label: i18n.tiltScheme,
                      values:
                        tiltSeries?.tiltingScheme !== undefined
                          ? [tiltSeries.tiltingScheme]
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
                    ...(!isIdentifiedObjectsEnabled
                      ? [
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
                        ]
                      : []),
                  ]}
                />
                {isIdentifiedObjectsEnabled && (
                  <MetadataTable
                    title={
                      <div className="flex items-center gap-sds-xxs ">
                        <span>{t('objects')}</span>
                        <Tooltip
                          tooltip={
                            <div className="flex flex-col gap-sds-xs py-sds-xxs w-[215px]">
                              <p>
                                <span className="font-semibold">Source:</span>{' '}
                                Objects are identified by the authors, curators
                                or contributed annotations.
                              </p>
                              <hr className="border-t border-light-sds-color-primitive-gray-300" />
                              <div className="flex items-center justify-between w-full">
                                <Icon
                                  sdsIcon="FlagOutline"
                                  sdsSize="xs"
                                  color="gray"
                                  shade={800}
                                  className="!w-[8px] !h-[8px]"
                                />
                                Annotation Available
                              </div>
                            </div>
                          }
                          placement="top"
                          sdsStyle="light"
                          offset={[0, -8]}
                        >
                          <Icon
                            sdsIcon="InfoCircle"
                            sdsSize="xs"
                            color="gray"
                            shade={500}
                            className="relative top-[-1px]"
                          />
                        </Tooltip>
                      </div>
                    }
                    data={[
                      {
                        label: '', // Empty label for full-width row
                        inline: true,
                        values: (() => {
                          if (isIdentifiedObjectsEnabled) {
                            // Create union of objectNames and identifiedObjectNames
                            const identifiedObjectNames = identifiedObjectsData
                              .map((obj) => obj?.objectName)
                              .filter(Boolean) as string[]
                            const allObjects = new Set([
                              ...objectNames.filter(Boolean),
                              ...identifiedObjectNames,
                            ])
                            return Array.from(allObjects).sort()
                          }
                          // Only show objectNames when feature flag is disabled
                          return objectNames.filter(Boolean)
                        })(),
                        fullWidth: true,
                        renderValues: (values: TableDataValue[]) => (
                          <div className="[&_li]:inline-flex [&_li]:items-center">
                            <CollapsibleList
                              entries={values.map((value) => ({
                                key: value.toString(),
                                entry: (
                                  <span className="flex items-center gap-[2px]">
                                    {value.toString()}
                                    {isIdentifiedObjectsEnabled &&
                                      objectNames.includes(
                                        value.toString(),
                                      ) && (
                                        <Icon
                                          sdsIcon="FlagOutline"
                                          sdsSize="xs"
                                          color="gray"
                                          shade={800}
                                          className="!w-[8px] !h-[8px] relative top-[-3px]"
                                        />
                                      )}
                                  </span>
                                ),
                              }))}
                              inlineVariant
                              collapseAfter={undefined}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                )}
              </div>
              {moreInfo}
            </div>
            <ContentsSummaryTable
              title={t('runContents')}
              data={{
                annotations: annotationsCount,
                tomograms: tomogramsCount,
                ctf: ctfCount > 0 ? t('available') : t('notSubmitted'),
                alignment:
                  alignmentsCount > 0 ? t('available') : t('notSubmitted'),
                frames: framesCount > 0 ? t('available') : t('notSubmitted'),
                tiltSeries:
                  tiltSeriesCount > 0 ? t('available') : t('notSubmitted'),
              }}
            />
          </div>
        </div>
      )}
    />
  )
}
