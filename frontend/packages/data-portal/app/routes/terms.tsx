import { MdxContent } from 'app/components/MDX'
import { getRepoFileContentResponse } from 'app/utils/repo.server'

export async function loader() {
  return getRepoFileContentResponse('website-docs/terms.mdx')
}

export default function TermsPage() {
  return <MdxContent />
}
