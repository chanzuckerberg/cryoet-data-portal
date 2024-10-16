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
  {
    href,
    to,
    variant,
    className,
    ...props
  }: VariantLinkProps & { href?: string },
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  let newTabProps: Partial<LinkProps> = {}
  const url = href ?? to

  if (typeof url === 'string' && isExternalUrl(url)) {
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
      to={url}
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
