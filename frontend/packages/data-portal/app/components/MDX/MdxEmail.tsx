import { Link } from 'app/components/Link'

export function MdxEmail({ to }: { to: string }) {
  return (
    <Link
      to={`mailto:${to}`}
      className="!text-black underline underline-offset-2"
    >
      {to}
    </Link>
  )
}
