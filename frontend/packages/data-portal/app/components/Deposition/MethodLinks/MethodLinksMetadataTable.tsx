import { useMemo } from 'react'

import { Accordion } from 'app/components/Accordion'
import { Link } from 'app/components/Link'
import { MetadataTable } from 'app/components/Table'
import { methodLabels, MethodType } from 'app/constants/methodTypes'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { generateMethodLinks, MethodLinkVariantProps } from './common'

const COLUMN_WIDTH = 170

type MethodData = {
  method_type: MethodType
  annotations_count: number
  method_description: string
  annotation_software: string
  links: MethodLinkVariantProps[]
}

function MethodLinkList({
  links: variantLinks,
}: {
  links: MethodLinkVariantProps[]
}) {
  const links = useMemo(() => generateMethodLinks(variantLinks), [variantLinks])

  const { t } = useI18n()

  if (links.length === 0) {
    return (
      <p className="text-sds-body-s leading-sds-body-s text-sds-gray-500">
        {t('notSubmitted')}
      </p>
    )
  }

  return (
    <ul>
      {links.map((link) => (
        <li key={`${link.url}_${link.i18nLabel}_${link.title}`}>
          <span className="text-sds-body-s leading-sds-body-s flex flex-row whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="text-sds-gray-black items-center flex flex-row">
              {link.icon}
              <span className="font-semibold ml-sds-xxs mr-sds-xs">
                {t(link.i18nLabel)}:
              </span>
            </span>
            <Link
              to={link.url}
              className="text-sds-info-400 overflow-hidden text-ellipsis"
            >
              {link.title ?? link.url}
            </Link>
          </span>
        </li>
      ))}
    </ul>
  )
}

function MethodSummarySection({
  label,
  data,
}: {
  label?: string
  data: MethodData
}) {
  const { t } = useI18n()

  const tableData = getTableData(
    {
      label: t('methodType'),
      values: [t(methodLabels[data.method_type])],
    },
    {
      label: t('numberOfAnnotations'),
      values: [data.annotations_count.toLocaleString()],
    },
    {
      label: t('annotationMethod'),
      values: [data.method_description],
    },
    {
      label: t('annotationSoftware'),
      values: [data.annotation_software],
    },
    {
      label: t('methodLinks'),
      values: [],
      renderValue: () => <MethodLinkList links={data.links} />,
    },
  )

  return (
    <div>
      {label && (
        <div className="flex flex-row gap-[10px] mt-sds-xs mb-[10px] items-center whitespace-nowrap">
          <p className="uppercase text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold text-sds-gray-600 basis-0 flex-initial">
            {label}
          </p>
          <div className="flex-grow h-[1px] bg-sds-gray-300" />
        </div>
      )}
      <MetadataTable
        data={tableData}
        tableCellLabelProps={{
          renderLoadingSkeleton: false,
          width: { min: COLUMN_WIDTH, max: COLUMN_WIDTH },
        }}
        tableCellValueProps={{
          renderLoadingSkeleton: false,
          width: { min: COLUMN_WIDTH },
        }}
      />
    </div>
  )
}

export function MethodLinksMetadataTable({
  initialOpen = true,
}: {
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const methodOne: MethodData = {
    method_type: 'hybrid',
    annotations_count: 3000,
    method_description:
      'Cumulative template-matching trained 2D CNN predictions + visual filtering + distance constraints + manual addition',
    annotation_software: 'pyTOM + Keras',
    links: [
      {
        variant: 'sourceCode',
        title: 'My model’s source code',
        url: 'https://example.com',
      },
      {
        variant: 'sourceCode',
        title: 'Lorem-Ispum3-Dolor-V-2_5',
        url: 'https://example.com',
      },
      {
        variant: 'modelWeights',
        title: 'Model Weights for model Lorem-Ispum3-Dolor-V-2_5',
        url: 'https://example.com',
      },
      {
        variant: 'website',
        url: 'www.url.com',
      },
      {
        variant: 'documentation',
        title: 'How to Use',
        url: 'https://example.com',
      },
      {
        variant: 'other',
        url: 'https://github.com/lorem-sum-dolor-amet-ipsiti-dolorum-ullrelle ',
      },
    ],
  }

  const methodTwo: MethodData = {
    method_type: 'manual',
    annotations_count: 1000,
    method_description:
      'Vestibulum id ligula porta felis euismod semper. Maecenas sed diam eget risus varius blandit sit amet non magna.',
    annotation_software: 'pyTOM + Keras',
    links: [],
  }

  const methodThree: MethodData = {
    method_type: 'automated',
    annotations_count: 6000,
    method_description:
      'Cumulative template-matching trained 2D CNN predictions + visual filtering + distance constraints + manual addition',
    annotation_software: 'pyTOM + Keras',
    links: [
      {
        variant: 'sourceCode',
        title: 'My model’s source code',
        url: 'https://example.com',
      },
      {
        variant: 'sourceCode',
        title: 'Lorem-Ispum3-Dolor-V-2_5',
        url: 'https://example.com',
      },
      {
        variant: 'modelWeights',
        title: 'Model Weights for model Lorem-Ispum3-Dolor-V-2_5',
        url: 'https://example.com',
      },
      {
        variant: 'website',
        url: 'www.url.com',
      },
      {
        variant: 'documentation',
        title: 'How to Use',
        url: 'https://example.com',
      },
      {
        variant: 'other',
        url: 'https://github.com/lorem-sum-dolor-amet-ipsiti-dolorum-ullrelle ',
      },
    ],
  }

  return (
    <Accordion
      id="method-links-summary-table"
      header={t('annotationMethodsSummary')}
      initialOpen={initialOpen}
    >
      <div className="flex flex-col gap-sds-xl">
        <MethodSummarySection label={t('methodOne')} data={methodOne} />
        <MethodSummarySection label={t('methodTwo')} data={methodTwo} />
        <MethodSummarySection label={t('methodThree')} data={methodThree} />
      </div>
    </Accordion>
  )
}
