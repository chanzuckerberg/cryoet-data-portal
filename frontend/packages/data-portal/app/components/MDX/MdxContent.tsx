import { MDXRemote } from 'next-mdx-remote'

import { useMdxFile } from 'app/hooks/useMdxFile'

import { MdxAccordion } from './MdxAccordion'
import { MdxBody } from './MdxBody'
import {
  MdxClass,
  MdxFunction,
  MdxOperator,
  MdxPunctuation,
  MdxString,
} from './MdxCode'
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
            Class: MdxClass,
            Email: MdxEmail,
            Function: MdxFunction,
            Str: MdxString,
            Op: MdxOperator,
            Punc: MdxPunctuation,
            PageTitle: MdxPageTitle,
          }}
        />
      </div>
    </div>
  )
}
