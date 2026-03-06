import { MdxContent } from 'app/components/MDX'
import { getMdxContent } from 'app/utils/repo.server'

export async function loader() {
  return getMdxContent('website-docs/dmca.mdx')
}

export default function DmcaPage() {
  return <MdxContent />
}
