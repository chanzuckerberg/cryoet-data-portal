import { CollapsibleList } from 'app/components/CollapsibleList'
import { AnnotationMethodMetadata } from 'app/hooks/useDepositionById'

import { generateMethodLinkProps } from './common'
import { MethodLink } from './MethodLink'

export function MethodLinkList({
  annotationMethod,
  methodLinks,
}: {
  annotationMethod: string
  methodLinks: AnnotationMethodMetadata['methodLinks']
}) {
  return (
    <CollapsibleList
      entries={generateMethodLinkProps(methodLinks).map((methodLinkProps) => ({
        key: `${annotationMethod}_${methodLinkProps.title}_${methodLinkProps.url}`,
        entry: (
          <MethodLink
            {...methodLinkProps}
            className="text-sds-body-xxs-400-wide leading-sds-body-xxs"
            linkProps={{
              className: 'text-light-sds-color-primitive-gray-600',
              variant: 'dashed-underlined',
            }}
          />
        ),
      }))}
      collapseAfter={1}
    />
  )
}
