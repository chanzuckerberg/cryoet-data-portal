import { Link as RemixLink, LinkProps } from '@remix-run/react'
import { ForwardedRef, forwardRef } from 'react'

import {
  DASHED_BORDERED_CLASSES,
  DASHED_UNDERLINED_CLASSES,
} from 'app/utils/classNames'
import { cnsNoMerge } from 'app/utils/cns'
import { isExternalUrl } from 'app/utils/url'

export type VariantLinkProps = LinkProps & {
  newTab?: boolean
  variant?: 'dashed-bordered' | 'dashed-underlined'
}

function BaseLink(
  {
    href,
    to,
    variant,
    className,
    newTab,
    ...props
  }: VariantLinkProps & { href?: string },
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  let newTabProps: Partial<LinkProps> = {}
  const url = href ?? to

  if (newTab || (typeof url === 'string' && isExternalUrl(url))) {
    // For new tabs, add rel=noreferrer for security:
    // https://web.dev/external-anchors-use-rel-noopener/#how-to-improve-your-site's-performance-and-prevent-security-vulnerabilities
    newTabProps = {
      target: '_blank',
      rel: 'noreferrer',
    }
  }

  // Handle modifier clicks and prevent default behavior
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // cmd, ctrl, shift, or middle click
    const isModifierClick =
      event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1

    if (isModifierClick) {
      event.preventDefault()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      window.open(event.currentTarget.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <RemixLink
      ref={ref}
      to={url}
      onClick={handleClick}
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
