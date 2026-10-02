import { Icon } from '@czi-sds/components'
import React from 'react'

import { SummaryData } from 'app/components/Dataset/utils'
import { Link } from 'app/components/Link'
import { Tooltip } from 'app/components/Tooltip'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'
import { cnsNoMerge } from 'app/utils/cns'

import { sectionHeaderStyles } from './constants'

interface ContentsTooltipType {
  [x: string]: {
    key: I18nKeys
    link: string
  }
}

const CONTENTS_TOOLTIPS: ContentsTooltipType = {
  datasets: {
    key: 'contentExplanationDatasetOverview',
    link: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#datasets',
  },
  runs: {
    key: 'contentExplanationRunOverview',
    link: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#runs',
  },
}

export function ContentsSummaryTable({
  runs,
  title,
  data,
}: {
  runs?: number | null
  title: string
  data: SummaryData
}) {
  const { t } = useI18n()
  const SUMMARY_TABLE_INFO: {
    labelKey: keyof SummaryData
    toolTipContent: string
    learnMoreLink?: string
  }[] = [
    {
      labelKey: 'annotations',
      toolTipContent: t('contentExplanationAnnotation'),
      learnMoreLink:
        'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#annotations',
    },
    {
      labelKey: 'tomograms',
      toolTipContent: t('contentExplanationTomograms'),
      learnMoreLink:
        'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_workflow.html#image-processing',
    },
    {
      labelKey: 'frames',
      toolTipContent: t('contentExplanationFrames'),
      learnMoreLink:
        'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_workflow.html#image-processing',
    },
    {
      labelKey: 'tiltSeries',
      toolTipContent: t('contentExplanationTiltSeries'),
      learnMoreLink:
        'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_workflow.html#image-processing',
    },
    {
      labelKey: 'ctf',
      toolTipContent: t('contentExplanationCtf'),
    },
    {
      labelKey: 'alignment',
      toolTipContent: t('contentExplanationAlignment'),
    },
  ]
  const page = title.includes('Dataset') ? 'datasets' : 'runs'
  return (
    <aside className="bg-[#FAFAFA] min-w-[192px] px-sds-l text-sds-caps-xxxs-600-wide py-sds-s text-light-sds-color-semantic-base-text-secondary rounded">
      <h3
        className={cnsNoMerge(
          'flex items-center gap-sds-xxs',
          sectionHeaderStyles,
          runs && '!mb-0',
        )}
      >
        {title}
        <Tooltip
          tooltip={
            <>
              {t(CONTENTS_TOOLTIPS[page].key)}{' '}
              <Link
                to={CONTENTS_TOOLTIPS[page].link}
                className="text-light-sds-color-primitive-blue-500 border-solid hover:border-b border-light-sds-color-primitive-blue-500"
              >
                {t('learnMore')}
              </Link>
            </>
          }
          className="group justify-self-start"
          placement="top"
          sdsStyle="light"
          offset={[0, -8]}
          slotProps={{
            tooltip: {
              style: {
                maxWidth: 250, // Override the max-width specification for dark sdsStyle.
              },
            },
          }}
        >
          <div className="w-sds-icon-s h-sds-icon-s flex items-center">
            <Icon
              sdsIcon="InfoCircle"
              sdsSize="xs"
              className="!fill-light-sds-color-primitive-gray-500"
            />
          </div>
        </Tooltip>
      </h3>
      {runs && (
        <h5 className="mb-sds-s text-sds-body-xxxs-400-wide ">
          ({t('totalRunsCount', { count: runs })})
        </h5>
      )}
      <div className="grid grid-cols-2 text-sds-body-xxxs-400-wide">
        {SUMMARY_TABLE_INFO.map((entry) => (
          <React.Fragment key={entry.labelKey}>
            <Tooltip
              className="group justify-self-start"
              placement="left"
              sdsStyle="light"
              offset={[0, -8]}
              slotProps={{
                tooltip: {
                  style: {
                    maxWidth: 250, // Override the max-width specification for dark sdsStyle.
                  },
                },
              }}
              tooltip={
                <>
                  {entry.toolTipContent}{' '}
                  {entry.learnMoreLink && (
                    <Link
                      className="text-light-sds-color-primitive-blue-500 border-solid hover:border-b border-light-sds-color-primitive-blue-500"
                      to={entry.learnMoreLink}
                      stopPropagation
                    >
                      {t('learnMore')}
                    </Link>
                  )}
                </>
              }
            >
              <h4 className="justify-self-start text-light-sds-color-semantic-base-text-primary underline decoration-dashed decoration-sds-color-semantic-base-border-primary font-semibold underline-offset-[2.5px] group-hover:decoration-solid">
                {t(entry.labelKey)}
              </h4>
            </Tooltip>
            <p className="text-right">{data[entry.labelKey]}</p>
          </React.Fragment>
        ))}
      </div>
    </aside>
  )
}
