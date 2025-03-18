import { cns, cnsNoMerge } from 'app/utils/cns'

export interface Metadata {
  key: string
  value: string

  uppercase?: boolean
  keyClass?: string
  valueClass?: string
}

export function InlineMetadata({
  label,
  fields,
  subheader = false,
}: {
  label?: string
  fields: Metadata[]
  subheader?: boolean
}) {
  const fieldsRender = (
    <ul className="list-none flex gap-sds-l items-baseline">
      {fields.map(({ key, value, uppercase, keyClass, valueClass }) => (
        <li
          className={cns(
            'flex flex-row items-baseline justify-left gap-sds-xxs',
            subheader && 'text-light-sds-color-primitive-gray-500',
          )}
          key={key + value}
        >
          <span
            className={cnsNoMerge(
              'font-semibold',
              subheader
                ? 'text-light-sds-color-primitive-gray-600 tracking-sds-body-xxs-600-wide text-sds-caps-xxs-600-wide leading-sds-caps-xxs'
                : 'text-sds-body-xxs-400-wide leading-sds-body-xxs',
              uppercase && 'uppercase',
              keyClass,
            )}
          >
            {key}:
          </span>

          <span
            className={cnsNoMerge(
              subheader
                ? 'text-sds-body-s-400-wide leading-sds-body-s'
                : 'text-sds-body-xxs-400-wide leading-sds-body-xxs',
              valueClass,
            )}
          >
            {value}
          </span>
        </li>
      ))}
    </ul>
  )

  if (label) {
    return (
      <div className="flex flex-row gap-sds-xl text-light-sds-color-primitive-gray-900  items-baseline">
        <span className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs font-semibold uppercase tracking-sds-caps-xxxs-600-wide">
          {label}
        </span>
        {fieldsRender}
      </div>
    )
  }

  return fieldsRender
}
