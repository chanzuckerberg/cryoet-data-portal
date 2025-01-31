export function ChallengeInfo({
  title,
  content,
}: {
  title: string
  content: string | JSX.Element
}) {
  return (
    <div className="font-semibold">
      <p className="text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps-xxxs uppercase text-sds-color-primitive-gray-600">
        {title}
      </p>
      <p className="text-sds-header-l leading-sds-header-l font-semibold">
        {content}
      </p>
    </div>
  )
}
