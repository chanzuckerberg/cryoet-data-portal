import { TableDataValue } from 'app/types/table'
import { cns } from 'app/utils/cns'

export function Matrix4x4({
  matrix,
  className,
}: {
  matrix: TableDataValue
  className?: string
}) {
  const commonBracketProps = 'w-sds-xs border border-solid border-black'

  return (
    <div className={cns('flex flex-row', className)}>
      {/* left bracket */}
      <div className={cns(commonBracketProps, 'border-r-0')} />
      {/* matrix */}
      <div className="grid grid-flow-row grid-rows-4 grid-cols-4 gap-x-sds-xxxs">
        {String(matrix)
          .split(' ')
          .map((value) => {
            return (
              <p className="w-[24.5px] h-[24px] text-center text-sds-body-s leading-sds-body-s ">
                {value}
              </p>
            )
          })}
      </div>
      {/* right bracket */}
      <div className={cns(commonBracketProps, 'border-l-0')} />
    </div>
  )
}
