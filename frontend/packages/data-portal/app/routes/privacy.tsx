import { MdxContent } from 'app/components/MDX'
import { getRepoFileContentResponse } from 'app/utils/repo.server'

export async function loader() {
  return getRepoFileContentResponse('website-docs/privacy-policy.mdx')
}

export default function PrivacyPage() {
  return <MdxContent />
}
