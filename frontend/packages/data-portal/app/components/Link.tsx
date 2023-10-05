import { Link as RemixLink, LinkProps } from '@remix-run/react'

import { isExternalUrl } from 'app/utils/url'

export function Link({ to, ...props }: LinkProps) {
  let newTabProps: Partial<LinkProps> = {}

  if (typeof to === 'string' && isExternalUrl(to)) {
    // For new tabs, add rel=noreferrer for security:
    // https://web.dev/external-anchors-use-rel-noopener/#how-to-improve-your-site's-performance-and-prevent-security-vulnerabilities
    newTabProps = {
      target: '_blank',
      rel: 'noreferrer',
    }
  }

  return <RemixLink to={to} {...props} {...newTabProps} />
}
