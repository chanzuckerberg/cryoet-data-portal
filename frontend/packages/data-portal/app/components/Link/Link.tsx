import { Link as RemixLink, LinkProps } from '@remix-run/react'
import { ForwardedRef, forwardRef } from 'react'

import { isExternalUrl } from 'app/utils/url'

function BaseLink(
  { to, ...props }: LinkProps,
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

  return <RemixLink ref={ref} to={to} {...props} {...newTabProps} />
}

export const Link = forwardRef(BaseLink)
