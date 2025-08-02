import { MdxContent } from 'app/components/MDX'
import { getRepoFileContentResponse } from 'app/utils/repo.server'

export async function loader() {
  return getRepoFileContentResponse('website-docs/dmca.mdx')
}

export default function DmcaPage() {
  return <MdxContent />
}
