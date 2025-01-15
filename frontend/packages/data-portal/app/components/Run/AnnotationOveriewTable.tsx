import { Icon } from '@czi-sds/components'
import { useMemo } from 'react'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { MethodLink } from 'app/components/Deposition/MethodLinks'
import { generateMethodLinks } from 'app/components/Deposition/MethodLinks/common'
import { MethodLinkDataType } from 'app/components/Deposition/MethodLinks/type'
import { Link } from 'app/components/Link'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { useAnnotation } from 'app/state/annotation'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { I18n } from '../I18n'
import { Tooltip } from '../Tooltip'

export function AnnotationOverviewTable() {
  const { activeAnnotation: annotation } = useAnnotation()
  const { t } = useI18n()
  const isDepositionsEnabled = useFeatureFlag('depositions')

  const methodLinks = useMemo(
    () =>
      generateMethodLinks(
        (annotation?.method_links ?? []) as MethodLinkDataType[],
      ),
    [annotation],
  )

  const { annotationShapes } = useRunById()
  const v2AnnotationShape = annotationShapes.find(
    (currentAnnotation) =>
      currentAnnotation.annotation?.id === annotation?.id &&
      currentAnnotation.shapeType === annotation?.shape_type,
  )

  if (!annotation) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-overview"
      header={t('annotationOverview')}
      data={[
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

        ...(isDepositionsEnabled && annotation.deposition
          ? [
              {
                label: t('depositionName'),
                values: ['Deposition Name'],
                renderValue: () => (
                  <Link
                    className="text-sds-color-primitive-blue-400"
                    to={`/depositions/${annotation.deposition?.id}`}
                  >
                    {annotation.deposition?.title}
                  </Link>
                ),
              },
              {
                label: t('depositionId'),
                values: [`${IdPrefix.Deposition}-${annotation.deposition?.id}`],
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
          label: t('alignmentId'),
          labelExtra: (
            <Tooltip
              tooltip={<I18n i18nKey="alignmentIdTooltip" />}
              placement="top"
            >
              <Icon
                sdsIcon="InfoCircle"
                sdsSize="s"
                className="!fill-sds-color-primitive-gray-500"
                sdsType="button"
              />
            </Tooltip>
          ),
          values: [
            v2AnnotationShape?.annotationFiles.edges.at(0)?.node.alignmentId ??
              '--',
          ],
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
                renderValue: () =>
                  methodLinks.length > 0 ? (
                    <ul>
                      {methodLinks.map((link) => (
                        <li key={`${link.url}_${link.i18nLabel}_${link.title}`}>
                          <MethodLink
                            {...link}
                            className="text-sds-header-s leading-sds-header-s whitespace-nowrap overflow-hidden text-ellipsis"
                            linkProps={{
                              className:
                                'text-sds-color-primitive-blue-400 overflow-hidden text-ellipsis',
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sds-body-s leading-sds-body-s text-sds-color-primitive-gray-500">
                      {t('notSubmitted')}
                    </p>
                  ),
              },
            ]
          : []),
      ]}
    />
  )
}
