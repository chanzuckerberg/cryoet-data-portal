import { MdxContent } from 'app/components/MDX'
import { getLocalFileContent } from 'app/utils/repo.server'

export async function loader() {
  return getLocalFileContent('website-docs/data-submission-policy.mdx')
}

export default function DataSubmissionPolicyPage() {
  return <MdxContent />
}
