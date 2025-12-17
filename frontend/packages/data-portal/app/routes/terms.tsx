import { MdxContent } from 'app/components/MDX'
import { getMdxContent } from 'app/utils/repo.server'

export async function loader() {
  return getMdxContent('website-docs/terms.mdx')
}

export default function TermsPage() {
  return <MdxContent />
}
