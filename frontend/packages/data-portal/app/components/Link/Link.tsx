import { Link as RemixLink, LinkProps } from '@remix-run/react'
import { ForwardedRef, forwardRef } from 'react'

import { cnsNoMerge } from 'app/utils/cns'
import { isExternalUrl } from 'app/utils/url'

export const DASHED_BORDERED_CLASSES =
  'border-b border-dashed hover:border-solid border-current'

export const DASHED_UNDERLINED_CLASSES =
  'underline underline-offset-[3px] decoration-dashed hover:decoration-solid'

function BaseLink(
  {
    to,
    variant,
    className,
    ...props
  }: LinkProps & { variant?: 'dashed-bordered' | 'dashed-underlined' },
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
