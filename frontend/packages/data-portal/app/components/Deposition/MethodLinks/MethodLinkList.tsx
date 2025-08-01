import { CollapsibleList } from 'app/components/CollapsibleList'
import { Tooltip } from 'app/components/Tooltip'
import { AnnotationMethodMetadata } from 'app/hooks/useDepositionById'
import { cns } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { generateMethodLinkProps } from './common'
import { MethodLink } from './MethodLink'

export function MethodLinkList({
  annotationMethod,
  methodLinks,
  simple,
}: {
  annotationMethod: string
  methodLinks: AnnotationMethodMetadata['methodLinks']
  simple?: boolean
}) {
  const isExpandDepositions = useFeatureFlag('expandDepositions')
  const shouldShowPillTooltip =
    isExpandDepositions && !simple && (methodLinks?.length ?? 0) > 1

  const methodLinkProps = generateMethodLinkProps(methodLinks)

  if (shouldShowPillTooltip) {
    const [firstLink, ...remainingLinks] = methodLinkProps

    return (
      <div className="flex flex-col gap-sds-xs">
        <MethodLink
          {...firstLink}
          className="text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide leading-sds-body-xxs"
          linkProps={{
            className: 'text-light-sds-color-primitive-gray-600',
            variant: 'dashed-underlined',
          }}
        />

        <div>
          {remainingLinks.length > 0 && (
            <Tooltip
              className="inline-flex"
              arrow={false}
              tooltip={
                <div className="flex flex-col gap-sds-xs">
                  {remainingLinks.map((methodLinkItem) => (
                    <MethodLink
                      key={`${annotationMethod}_${methodLinkItem.title}_${methodLinkItem.url}`}
                      {...methodLinkItem}
                      className="text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide leading-sds-body-xxs"
                      linkProps={{
                        className: 'text-light-sds-color-primitive-gray-600',
                        variant: 'dashed-underlined',
                      }}
                      simple={simple}
                    />
                  ))}
                </div>
              }
            >
              <span
                className={cns(
                  'inline-flex items-center py-sds-xxxs px-sds-xs rounded-full',
                  'text-sds-body-xxxs-400-wide tracking-sds-body-xxxs-400-wide leading-sds-body-xxxs',
                  'text-light-sds-color-semantic-neutral-text',
                  'bg-light-sds-color-semantic-neutral-surface-secondary',
                  'cursor-default',
                )}
              >
                +{remainingLinks.length} more
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

  return (
    <CollapsibleList
      entries={methodLinkProps.map((methodLinkItem) => ({
        key: `${annotationMethod}_${methodLinkItem.title}_${methodLinkItem.url}`,
        entry: (
          <MethodLink
            {...methodLinkItem}
            className={
              simple
                ? 'text-sds-body-s-400-wide tracking-sds-body-s-400-wide leading-sds-body-s'
                : 'text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide leading-sds-body-xxs'
            }
            linkProps={{
              className: simple
                ? 'text-light-sds-color-semantic-accent-text-action'
                : 'text-light-sds-color-primitive-gray-600',
              variant: simple ? undefined : 'dashed-underlined',
            }}
            simple={simple}
          />
        ),
      }))}
      collapseAfter={1}
    />
  )
}
