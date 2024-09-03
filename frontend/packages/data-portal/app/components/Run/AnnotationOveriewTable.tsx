import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { MethodLink } from '../Deposition/MethodLinks'
import {
  generateMethodLinks,
  MethodLinkVariantProps,
} from '../Deposition/MethodLinks/common'
import { Link } from '../Link'

const METHOD_LINK_VARIANTS: MethodLinkVariantProps[] = [
  {
    variant: 'sourceCode',
    url: 'https://www.example.com',
    title: "My model's source code",
  },
  {
    variant: 'sourceCode',
    url: 'https://www.example.com',
    title: 'Lorem-Ipsum3-D source code',
  },
  {
    variant: 'modelWeights',
    url: 'https://www.example.com',
    title: 'Model Weights',
  },
  {
    variant: 'website',
    url: 'https://www.example.com',
    title: 'Optional Custom Link Name',
  },
  {
    variant: 'documentation',
    url: 'https://www.example.com',
    title: 'Optional Custom Link Name',
  },
  {
    variant: 'other',
    url: 'https://www.example.com',
    title: 'Optional Custom Link Name',
  },
]

const METHOD_LINKS = generateMethodLinks(METHOD_LINK_VARIANTS)

export function AnnotationOverviewTable() {
  const { activeAnnotation: annotation } = useAnnotation()
  const { t } = useI18n()
  const isDepositionsEnabled = useFeatureFlag('depositions')

  if (!annotation) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-overview"
      header={t('annotationOverview')}
      data={[
        {
          label: t('annotationId'),
          values: [annotation.id],
        },
        {
          label:
            annotation.authors.length === 1
              ? t('annotationAuthor')
              : t('annotationAuthors'),
          labelExtra: <AuthorLegend inline />,
          renderValue: () => {
            return <AuthorList authors={annotation.authors} large />
          },
          values: [''],
          className: 'leading-sds-body-s',
        },
        {
          label: t('publication'),
          values: [annotation.annotation_publication ?? '--'],
        },

        ...(isDepositionsEnabled
          ? [
              {
                label: t('depositionName'),
                values: ['Deposition Name'],
                renderValue: () => (
                  <Link className="text-sds-primary-400" to="/deposition/123">
                    Deposition Name
                  </Link>
                ),
              },
              {
                label: t('depositionId'),
                values: ['CZCDP-12345'],
              },
            ]
          : []),

        {
          label: t('depositionDate'),
          values: [annotation.deposition_date],
        },
        {
          label: t('releaseDate'),
          values: [annotation.release_date],
        },
        {
          label: t('lastModifiedDate'),
          values: [annotation.last_modified_date ?? '--'],
        },
        {
          label: t('methodType'),
          values: [annotation.method_type ?? '--'],
        },
        {
          label: t('annotationMethod'),
          values: [annotation.annotation_method],
        },
        {
          label: t('annotationSoftware'),
          values: [annotation.annotation_software ?? '--'],
        },

        ...(isDepositionsEnabled
          ? [
              {
                label: t('methodLinks'),
                // No value required for this field, render only links component
                values: [''],
                renderValue: () => (
                  <ul>
                    {METHOD_LINKS.map((link) => (
                      <li key={`${link.url}_${link.i18nLabel}_${link.title}`}>
                        <MethodLink {...link} />
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]
          : []),
      ]}
    />
  )
}
