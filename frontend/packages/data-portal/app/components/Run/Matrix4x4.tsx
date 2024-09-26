import { cns } from 'app/utils/cns'

export const IDENTITY_MATRIX_4_X_4 = '1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1'

export function Matrix4x4({
  matrix,
  className,
}: {
  matrix: string
  className?: string
}) {
  const commonBracketProps = 'w-sds-xs border border-solid border-black'

  return (
    <div className={cns('flex flex-row', className)}>
      {/* left bracket */}
      <div className={cns(commonBracketProps, 'border-r-0')} />
      {/* matrix */}
      <div className="grid grid-flow-row grid-rows-4 grid-cols-4 gap-x-sds-xxxs">
        {matrix.split(' ').map((value) => {
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
