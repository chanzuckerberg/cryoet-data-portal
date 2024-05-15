import { LinkProps } from '@remix-run/react'
import { isString } from 'lodash-es'

export function MockLinkComponent({ to, ...props }: LinkProps) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={isString(to) ? to : to.pathname} {...props} />
}
