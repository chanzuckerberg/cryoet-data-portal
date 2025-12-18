import { MdxContent } from 'app/components/MDX'
import { getMdxContent } from 'app/utils/repo.server'

export async function loader() {
  return getMdxContent('website-docs/data-submission-policy.mdx')
}

export default function DataSubmissionPolicyPage() {
  return <MdxContent />
}
