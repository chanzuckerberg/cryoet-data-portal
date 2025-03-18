import { ReactNode } from 'react'

export function ChallengeInfo({
  title,
  content,
}: {
  title: string
  content: string | ReactNode
}) {
  return (
    <div className="font-semibold">
      <div className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs tracking-sds-caps-xxxs uppercase text-light-sds-color-primitive-gray-600">
        {title}
      </div>
      <div className="text-sds-header-l-600-wide leading-sds-header-l font-semibold">
        {content}
      </div>
    </div>
  )
}
