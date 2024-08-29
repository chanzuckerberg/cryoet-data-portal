import { Link as RemixLink, LinkProps } from '@remix-run/react'
import { ForwardedRef, forwardRef } from 'react'

import {
  DASHED_BORDERED_CLASSES,
  DASHED_UNDERLINED_CLASSES,
} from 'app/utils/classNames'
import { cnsNoMerge } from 'app/utils/cns'
import { isExternalUrl } from 'app/utils/url'

export type VariantLinkProps = LinkProps & {
  variant?: 'dashed-bordered' | 'dashed-underlined'
}

function BaseLink(
  { to, variant, className, ...props }: VariantLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  let newTabProps: Partial<LinkProps> = {}

  if (typeof to === 'string' && isExternalUrl(to)) {
    // For new tabs, add rel=noreferrer for security:
    // https://web.dev/external-anchors-use-rel-noopener/#how-to-improve-your-site's-performance-and-prevent-security-vulnerabilities
    newTabProps = {
      target: '_blank',
      rel: 'noreferrer',
    }
  }

  return (
    <RemixLink
      ref={ref}
      to={to}
      className={cnsNoMerge(
        variant === 'dashed-bordered' && DASHED_BORDERED_CLASSES,
        variant === 'dashed-underlined' && DASHED_UNDERLINED_CLASSES,
        className,
      )}
      {...props}
      {...newTabProps}
    />
  )
}

export const Link = forwardRef(BaseLink)
