import { MDXRemote } from 'next-mdx-remote'

import { useMdxFile } from 'app/hooks/useMdxFile'

import { MdxAccordion } from './MdxAccordion'
import { MdxBody } from './MdxBody'
import { MdxEmail } from './MdxEmail'
import { MdxPageTitle } from './MdxPageTitle'

export function MdxContent() {
  const { content } = useMdxFile()

  return (
    <div className="py-sds-xxl px-sds-xl flex flex-auto justify-center">
      <div className="w-full max-w-content-small">
        <MDXRemote
          {...content}
          components={{
            Accordion: MdxAccordion,
            Body: MdxBody,
            Email: MdxEmail,
            PageTitle: MdxPageTitle,
          }}
        />
      </div>
    </div>
  )
}
