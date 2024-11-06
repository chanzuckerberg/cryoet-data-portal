import { Link } from 'app/components/Link'

export function MdxLink(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
) {
  const { href, children } = props
  return <Link to={href ?? '#'}>{children}</Link>
}
