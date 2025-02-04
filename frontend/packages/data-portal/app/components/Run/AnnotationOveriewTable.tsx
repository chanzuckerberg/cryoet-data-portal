import { Icon } from '@czi-sds/components'
import { useMemo } from 'react'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { MethodLink } from 'app/components/Deposition/MethodLinks'
import { generateMethodLinkProps } from 'app/components/Deposition/MethodLinks/common'
import { Link } from 'app/components/Link'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { useSelectedAnnotationShape } from 'app/state/annotation'

import { I18n } from '../I18n'
import { Tooltip } from '../Tooltip'

export function AnnotationOverviewTable() {
  const { selectedAnnotationShape } = useSelectedAnnotationShape()
  const { t } = useI18n()

  const methodLinks = useMemo(
    () =>
      generateMethodLinkProps(
        selectedAnnotationShape?.annotation?.methodLinks.edges.map(
          (methodLink) => methodLink.node,
        ) ?? [],
      ),
    [selectedAnnotationShape],
  )

  if (!selectedAnnotationShape) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-overview"
      header={t('annotationOverview')}
      data={[
        {
          label:
            selectedAnnotationShape.annotation?.authors.edges.length === 1
              ? t('annotationAuthor')
              : t('annotationAuthors'),
          labelExtra: <AuthorLegend inline />,
          renderValue: () => {
            return (
              <AuthorList
                authors={
                  selectedAnnotationShape.annotation?.authors.edges.map(
                    (author) => author.node,
                  ) ?? []
                }
                large
              />
            )
          },
          values: [''],
          className: 'leading-sds-body-s',
        },
        {
          label: t('publication'),
          values: [
            selectedAnnotationShape.annotation?.annotationPublication ?? '--',
          ],
        },

        ...(selectedAnnotationShape.annotation?.deposition
          ? [
              {
                label: t('depositionName'),
                values: ['Deposition Name'],
                renderValue: () => (
                  <Link
                    className="text-sds-color-primitive-blue-400"
                    to={`/depositions/${selectedAnnotationShape.annotation?.deposition?.id}`}
                  >
                    {selectedAnnotationShape.annotation?.deposition?.title}
                  </Link>
                ),
              },
              {
                label: t('depositionId'),
                values: [
                  `${IdPrefix.Deposition}-${selectedAnnotationShape.annotation?.deposition?.id}`,
                ],
              },
            ]
          : []),

        {
          label: t('depositionDate'),
          values: [
            selectedAnnotationShape.annotation?.depositionDate.split('T')[0] ??
              '--',
          ],
        },
        {
          label: t('releaseDate'),
          values: [
            selectedAnnotationShape.annotation?.releaseDate.split('T')[0] ??
              '--',
          ],
        },
        {
          label: t('lastModifiedDate'),
          values: [
            selectedAnnotationShape.annotation?.lastModifiedDate.split(
              'T',
            )[0] ?? '--',
          ],
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
            // Assumes all files have the same alignment ID.
            selectedAnnotationShape?.annotationFiles.edges[0]?.node
              .alignmentId ?? '--',
          ],
        },
        {
          label: t('methodType'),
          values: [selectedAnnotationShape.annotation?.methodType ?? '--'],
        },
        {
          label: t('annotationMethod'),
          values: [
            selectedAnnotationShape.annotation?.annotationMethod ?? '--',
          ],
        },
        {
          label: t('annotationSoftware'),
          values: [
            selectedAnnotationShape.annotation?.annotationSoftware ?? '--',
          ],
        },
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
      ]}
    />
  )
}
