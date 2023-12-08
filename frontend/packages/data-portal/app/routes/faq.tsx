import { MdxContent } from 'app/components/MDX'
import { getLocalFileContent } from 'app/utils/repo.server'

export async function loader() {
  return getLocalFileContent('website-docs/faq.mdx')
}

export default function FaqPage() {
  return <MdxContent />
}
